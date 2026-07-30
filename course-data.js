(function () {
  const course = Object.freeze({
    courseName: 'Prompting Up a Business',
    category: 'KI-Launch-Lab',
    tagline: 'Baue mit KI die erste Version deines Business.',
    price: '4.990 €',
    groupSize: 5,
    kickoffHours: 2,
    sessionCount: 8,
    hoursPerSession: 4,
    totalLiveHours: 34,
    duration: '5 Wochen',
    format: 'Live-Online-Kohorte',
    project: 'Eigenes Business-Projekt',
    guidance: 'Projektarbeit und individuelle Reviews',
    primaryCta: 'Für die nächste Kohorte bewerben',
    secondaryCta: 'Programm ansehen',
    applicationUrl: '/bewerben/',
    programUrl: '/kurse/prompting-up-a-business/',
    operatorEmail: 'sebastianvauth@gmail.com',
    formatSummary: '2 Stunden KI-Agenten-Kickoff plus 8 Live-Termine à 4 Stunden über 5 Wochen',
    priceIncludes: '2 Stunden KI-Agenten-Kickoff, 8 Live-Termine à 4 Stunden, Vorlagen, Projektarbeit und individuelle Reviews'
  });

  const cohorts = Object.freeze([
    Object.freeze({
      id: 'cohort-autumn-2026',
      label: 'September-Kohorte 2026',
      status: 'open',
      seatsAvailable: 4,
      kickoffDate: '2026-09-21',
      sessionDates: Object.freeze([
        Object.freeze({ session: 1, date: '2026-09-28' }),
        Object.freeze({ session: 2, date: '2026-10-01' }),
        Object.freeze({ session: 3, date: '2026-10-05' }),
        Object.freeze({ session: 4, date: '2026-10-08' }),
        Object.freeze({ session: 5, date: '2026-10-12' }),
        Object.freeze({ session: 6, date: '2026-10-15' }),
        Object.freeze({ session: 7, date: '2026-10-19' }),
        Object.freeze({ session: 8, date: '2026-10-22' })
      ]),
      applicationDeadline: null,
      dateRange: '21. September bis 22. Oktober 2026',
      publicSummary: 'Nächste Kohorte: 21. September bis 22. Oktober 2026'
    }),
    Object.freeze({
      id: 'cohort-winter-2026',
      label: 'November-Kohorte 2026',
      status: 'open',
      seatsAvailable: 5,
      kickoffDate: '2026-11-09',
      sessionDates: Object.freeze([
        Object.freeze({ session: 1, date: '2026-11-16' }),
        Object.freeze({ session: 2, date: '2026-11-19' }),
        Object.freeze({ session: 3, date: '2026-11-23' }),
        Object.freeze({ session: 4, date: '2026-11-26' }),
        Object.freeze({ session: 5, date: '2026-11-30' }),
        Object.freeze({ session: 6, date: '2026-12-03' }),
        Object.freeze({ session: 7, date: '2026-12-07' }),
        Object.freeze({ session: 8, date: '2026-12-10' })
      ]),
      applicationDeadline: null,
      dateRange: '9. November bis 10. Dezember 2026',
      publicSummary: 'November-Kohorte: 9. November bis 10. Dezember 2026'
    })
  ]);

  window.JetztAberPrompt = Object.freeze({
    course,
    cohorts,
    applicationEndpoint: ''
  });
})();
