const siteData = window.JetztAberPrompt || { course: {}, cohorts: [] };
const courseData = siteData.course || {};

document.querySelectorAll('[data-course-text]').forEach((element) => {
  const key = element.dataset.courseText;
  if (Object.prototype.hasOwnProperty.call(courseData, key)) {
    element.textContent = String(courseData[key]);
  }
});

document.querySelectorAll('[data-course-href]').forEach((element) => {
  const key = element.dataset.courseHref;
  if (courseData[key]) element.setAttribute('href', courseData[key]);
});

const getCohortAvailability = (cohort) => {
  const available = cohort.seatsAvailable;
  if (cohort.status !== 'open' || available < 1) return 'nicht verfügbar';
  if (available === 1) return 'noch 1 Platz';
  return `noch ${available} Plätze`;
};

const getCohortState = (cohort) => {
  if (cohort.status !== 'open' || cohort.seatsAvailable < 1) return 'unavailable';
  if (cohort.seatsAvailable <= 3) return 'limited';
  return 'available';
};

document.querySelectorAll('[data-cohort-overview]').forEach((container) => {
  const title = document.createElement('strong');
  title.className = 'cohort-overview-title';
  title.textContent = 'Nächste Kohorten:';

  const list = document.createElement('ul');
  list.className = 'cohort-overview-list';

  siteData.cohorts.forEach((cohort) => {
    if (!cohort.dateRange) return;
    const item = document.createElement('li');
    item.dataset.cohortState = getCohortState(cohort);

    const dot = document.createElement('span');
    dot.className = 'cohort-overview-dot';
    dot.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('span');
    copy.textContent = `${cohort.dateRange} – ${getCohortAvailability(cohort)}`;

    item.append(dot, copy);
    list.append(item);
  });

  container.replaceChildren(title, list);
});

const setCohortAvailability = (element, cohort) => {
  if (!cohort || !Number.isInteger(cohort.seatsAvailable)) return;

  const available = cohort.seatsAvailable;
  element.dataset.availabilityState = available > 0 ? 'available' : 'sold-out';
  if (available === 1) element.textContent = 'Noch 1 Platz verfügbar';
  else if (available > 1) element.textContent = `Noch ${available} Plätze verfügbar`;
  else element.textContent = 'Aktuell ausgebucht';
};

const formatCohortDate = (isoDate) => new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin'
}).format(new Date(`${isoDate}T12:00:00+02:00`));

const appendCohortDates = (list, cohort) => {
  const dates = [
    { label: 'KI-Agenten-Kickoff', date: cohort.kickoffDate },
    ...cohort.sessionDates.map((item) => ({ label: `Termin ${item.session}`, date: item.date }))
  ];

  dates.forEach((item) => {
    const entry = document.createElement('li');
    const label = document.createElement('span');
    const time = document.createElement('time');
    label.textContent = item.label;
    time.dateTime = item.date;
    time.textContent = formatCohortDate(item.date);
    entry.append(label, time);
    list.append(entry);
  });
};

document.querySelectorAll('[data-cohort-schedules]').forEach((container) => {
  const scheduledCohorts = siteData.cohorts.filter((cohort) => (
    cohort.status === 'open' && cohort.kickoffDate && cohort.sessionDates.length
  ));

  scheduledCohorts.forEach((cohort) => {
    const schedule = document.createElement('section');
    schedule.className = 'cohort-schedule';

    const title = document.createElement('h4');
    title.id = `${cohort.id}-schedule-title`;
    title.textContent = cohort.label;
    schedule.setAttribute('aria-labelledby', title.id);

    const dateRange = document.createElement('p');
    dateRange.className = 'cohort-schedule-range';
    dateRange.textContent = cohort.dateRange;

    const availability = document.createElement('p');
    availability.className = 'availability-badge';
    availability.setAttribute('role', 'status');
    setCohortAvailability(availability, cohort);

    const dates = document.createElement('ol');
    dates.className = 'cohort-dates';
    dates.setAttribute('aria-label', `Termine der ${cohort.label}`);
    appendCohortDates(dates, cohort);

    schedule.append(title, dateRange, availability, dates);
    container.append(schedule);
  });
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

if (navToggle && nav) {
  const closeNav = () => {
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menü öffnen');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    document.body.classList.toggle('nav-open', isOpen);
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

const trackEvent = (name, properties = {}) => {
  const detail = {
    name,
    page: window.location.pathname,
    ...properties
  };

  window.dispatchEvent(new CustomEvent('jap:analytics', { detail }));

  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: detail });
  }
};

document.querySelectorAll('[data-track]').forEach((element) => {
  element.addEventListener('click', () => {
    const openCohort = siteData.cohorts.find((item) => item.status === 'open');
    trackEvent(element.dataset.track, {
      cta_location: element.dataset.ctaLocation || undefined,
      cohort_id: element.dataset.cohortId || openCohort?.id || undefined
    });
  });
});

document.querySelectorAll('details').forEach((details) => {
  details.addEventListener('toggle', () => {
    if (details.open) trackEvent('faq_open');
  });
});

if (document.body.dataset.page === 'program') trackEvent('program_view');

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const applicationForm = document.querySelector('[data-application-form]');

if (applicationForm) {
  const cohortSelect = applicationForm.querySelector('[data-cohort-select]');
  siteData.cohorts.filter((cohort) => cohort.status === 'open').forEach((cohort) => {
    const option = document.createElement('option');
    option.value = cohort.id;
    option.textContent = cohort.sessionDates.length
      ? `${cohort.label} · ${cohort.dateRange}`
      : `${cohort.label} – Termine folgen`;
    cohortSelect.append(option);
  });

  let applicationStarted = false;
  applicationForm.addEventListener('focusin', () => {
    if (!applicationStarted) {
      applicationStarted = true;
      trackEvent('application_start');
    }
  });

  const setFieldError = (field, message) => {
    const error = applicationForm.querySelector(`[data-error-for="${field.name}"]`);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message;
  };

  const validateField = (field) => {
    let message = '';
    if (field.validity.valueMissing) message = 'Bitte fülle dieses Feld aus.';
    else if (field.validity.typeMismatch) message = 'Bitte gib eine gültige E-Mail-Adresse ein.';
    else if (field.validity.tooShort) message = `Bitte verwende mindestens ${field.minLength} Zeichen.`;
    setFieldError(field, message);
    return !message;
  };

  applicationForm.querySelectorAll('input, select, textarea').forEach((field) => {
    if (field.type !== 'hidden') field.addEventListener('blur', () => validateField(field));
  });

  applicationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = [...applicationForm.querySelectorAll('input, select, textarea')];
    const isValid = fields.map(validateField).every(Boolean);
    const status = applicationForm.querySelector('[data-form-status]');

    if (!isValid) {
      trackEvent('application_error');
      status.hidden = false;
      status.className = 'form-status is-error';
      status.textContent = 'Bitte prüfe die markierten Felder.';
      applicationForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const formData = new FormData(applicationForm);
    const cohort = siteData.cohorts.find((item) => item.id === formData.get('cohort'));
    const safeEventData = {
      cohort_id: cohort?.id,
      starting_point: formData.get('startingPoint')
    };

    const submitButton = applicationForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Bewerbung wird vorbereitet …';
    status.hidden = true;

    const payload = Object.fromEntries(formData.entries());

    try {
      if (siteData.applicationEndpoint) {
        const response = await fetch(siteData.applicationEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'omit'
        });
        if (!response.ok) throw new Error('Application endpoint returned an error.');
        applicationForm.reset();
        status.hidden = false;
        status.className = 'form-status is-success';
        status.innerHTML = '<strong>Danke für deine Bewerbung.</strong><br>Als nächster Schritt folgt ein kurzes persönliches Gespräch, in dem wir dein Projekt, deine Ausgangslage und die Passung zum Programm besprechen.';
        status.focus();
        trackEvent('application_submit', safeEventData);
      } else {
        const labels = {
          name: 'Name',
          email: 'E-Mail',
          workSituation: 'Berufliche Situation',
          cohort: 'Gewünschte Kohorte',
          startingPoint: 'Ausgangspunkt',
          idea: 'Idee oder Problemfeld',
          desiredOutcome: 'Gewünschtes Ergebnis',
          availableTime: 'Verfügbare Zeit',
          agentExperience: 'Erfahrung mit KI-Agenten'
        };
        const body = Object.entries(labels)
          .map(([key, label]) => `${label}:\n${payload[key] || '–'}`)
          .join('\n\n');
        const subject = `Bewerbung – ${courseData.courseName || 'Prompting Up a Business'}`;
        const mailtoUrl = `mailto:${courseData.operatorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        status.hidden = false;
        status.className = 'form-status is-success';
        status.replaceChildren();

        const statusTitle = document.createElement('strong');
        statusTitle.textContent = 'Deine Bewerbung ist vorbereitet.';

        const statusCopy = document.createElement('p');
        statusCopy.textContent = 'Öffne den vorausgefüllten E-Mail-Entwurf oder kopiere die vollständige Bewerbung, damit du sie in deinem bevorzugten E-Mail-Programm senden kannst.';

        const mailLink = document.createElement('a');
        mailLink.className = 'button secondary form-status-action';
        mailLink.href = mailtoUrl;
        mailLink.textContent = 'In E-Mail-App öffnen';
        mailLink.addEventListener('click', () => trackEvent('application_email_open', safeEventData));

        const copyText = `An: ${courseData.operatorEmail}\nBetreff: ${subject}\n\n${body}`;
        const copyButton = document.createElement('button');
        copyButton.className = 'button primary form-status-action';
        copyButton.type = 'button';
        copyButton.textContent = 'Bewerbung kopieren';

        const copyFallback = document.createElement('textarea');
        copyFallback.className = 'form-copy-text';
        copyFallback.value = copyText;
        copyFallback.readOnly = true;
        copyFallback.rows = 9;
        copyFallback.hidden = true;
        copyFallback.setAttribute('aria-label', 'Vorbereitete Bewerbung zum Kopieren');

        copyButton.addEventListener('click', async () => {
          try {
            if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable.');
            await navigator.clipboard.writeText(copyText);
            copyButton.textContent = 'Bewerbung kopiert';
            trackEvent('application_copy', safeEventData);
          } catch (error) {
            copyFallback.hidden = false;
            copyFallback.focus();
            copyFallback.select();
            copyButton.textContent = 'Text ist markiert – jetzt kopieren';
          }
        });

        const actionGroup = document.createElement('div');
        actionGroup.className = 'form-status-actions';
        actionGroup.append(copyButton, mailLink);

        const fallback = document.createElement('small');
        fallback.append('Sende die Bewerbung anschließend an ');
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${courseData.operatorEmail}`;
        emailLink.textContent = courseData.operatorEmail;
        fallback.append(emailLink, '.');

        status.append(statusTitle, statusCopy, actionGroup, copyFallback, fallback);
        status.focus();
        trackEvent('application_prepare', safeEventData);
      }
    } catch (error) {
      trackEvent('application_error', safeEventData);
      status.hidden = false;
      status.className = 'form-status is-error';
      status.textContent = 'Die Bewerbung konnte gerade nicht vorbereitet werden. Bitte versuche es erneut oder schreibe direkt an sebastianvauth@gmail.com.';
      status.focus();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = courseData.primaryCta || 'Bewerbung absenden';
    }
  });
}
