const db = {
  baseURL: 'https://yoga.afazakas.com',
  getJWT: () => {
    return fetch('/api/examples/jwt').then((res) => res.json())
  },
  schedules: {
    getDayClasses: (date) => {
      return fetch(`${db.baseURL}/schedules/classes/date/${date}`).then((res) =>
        res.json()
      )
    },
    getSchedule: (startDate, endDate) => {
      return fetch(`${db.baseURL}/schedules/${startDate}/${endDate}`).then(
        (res) => res.json()
      )
    },
    getLatestSchedule: () => {
      return fetch(`${db.baseURL}/schedules/latest`).then((res) => res.json())
    },
    postSchedule: (weekSchedule, jwt, startDate, endDate) => {
      return fetch(`${db.baseURL}/schedules/${startDate}/${endDate}`, {
        method: 'POST',
        headers: {
          Authorization: jwt,
        },
        body: JSON.stringify(weekSchedule),
      }).then((res) => {
        if (!res.ok) return Promise.reject(res.statusText)

        return res.json()
      })
    },
    removeSubscription: (jwt, id) =>
      fetch(`${db.baseURL}/subscriptions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: jwt,
        },
      }).then((res) => res.json()),
    postSubscription: (subscription, jwt) => {
      return fetch(`${db.baseURL}/subscriptions`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          Authorization: jwt.jwtToken,
        },
      }).then((res) => res.json())
    },
    updateScheduledClassLink: (scheduleDayId, link, jwtToken) => {
      return fetch(
        `${db.baseURL}/schedules/links/classes/${scheduleDayId}/${link}`,
        {
          method: 'PUT',
          headers: {
            Authorization: jwtToken,
          },
        }
      ).then((res) => res.json())
    },
    getUserSubscriptionByClass: (userId, classId) => {
      return fetch(
        `${db.baseURL}/subscriptions/user/${userId}/class/${classId}`
      ).then((res) => res.json())
    },
  },
  subscriptions: {
    removeUserSubscription: (userSubscriptionId, jwtToken) => {
      return fetch(`${db.baseURL}/subscriptions/user/${userSubscriptionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: jwtToken,
        },
      }).then((res) => res.json())
    },
    getSubscriptions: () => {
      return fetch(`${db.baseURL}/subscriptions`).then((res) => res.json())
    },
    removeSubscription: (jwt, id, image) =>
      fetch(`${db.baseURL}/subscriptions/${id}/${image}`, {
        method: 'DELETE',
        headers: {
          Authorization: jwt,
        },
      }).then((res) => res.json()),
    postSubscription: (subscription, jwt) => {
      return fetch(`${db.baseURL}/subscriptions`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          Authorization: jwt.jwtToken,
        },
      }).then((res) => res.json())
    },
    getSubscriptionNames: () => {
      return fetch(`${db.baseURL}/subscriptionnames`).then((res) => res.json())
    },
    postSubscriptionToUser: (jwt, user, subscription) => {
      return fetch(`${db.baseURL}/subscriptions/${user}/${subscription}`, {
        method: 'POST',
        headers: {
          Authorization: jwt.jwtToken,
        },
      }).then((res) => res.json())
    },
    decreaseCoverage: (coverageType, id) => {
      return fetch(
        `${db.baseURL}/subscriptions/decrease/${coverageType}/${id}`
      ).then((res) => res.json())
    },
  },
  bookings: {
    postBooking: (jwt, scheduleWeekId, classType) => {
      return fetch(`${db.baseURL}/bookings/${scheduleWeekId}/${classType}`, {
        headers: {
          Authorization: jwt,
        },
        method: 'POST',
      }).then((res) => res.json())
    },
    changeStatus: (jwt, id, status) => {
      return fetch(`${db.baseURL}/chgstatus/${id}/${status}`, {
        headers: {
          Authorization: jwt,
        },
        method: 'GET',
      }).then((res) => res.json())
    },
    getClassBookings: (weekScheduleId) => {
      return fetch(`${db.baseURL}/bookings/classes/${weekScheduleId}`).then(
        (res) => res.json()
      )
    },
  },
  classes: {
    getClasses: () => {
      return fetch(`${db.baseURL}/classes`).then((res) => res.json())
    },
    deleteClass: (id) => {
      return fetch(`${db.baseURL}/classes/dlt/${id}`).then((res) => res.json())
    },
    dailyAttendences: (id) => {
      return fetch(`${db.baseURL}/classes/dailyattendences/${id}`).then((res) =>
        res.json()
      )
    },
    postNewClass: (jwt, newclass) => {
      return fetch(`${db.baseURL}/classes/newclass`, {
        method: 'POST',
        body: JSON.stringify(newclass),
        headers: {
          Authorization: jwt.jwtToken,
        },
      }).then((res) => res.json())
    },
  },
  users: {
    getClients: () => {
      return fetch(`${db.baseURL}/users/clients`).then((res) => res.json())
    },
    getOneClient: (jwt) => {
      return fetch(`${db.baseURL}/user/${jwt}`).then((res) => res.json())
    },
    queryUsers: (criteria, value) => {
      return fetch(`${db.baseURL}/users/${criteria}/${value}`).then((res) =>
        res.json()
      )
    },
    postUser: (user) => {
      return fetch(`${db.baseURL}/users`, {
        method: 'POST',
        body: JSON.stringify(user),
      }).then((res) => res.json())
    },
  },
  events: {
    getEvents: () => {
      return fetch(`${db.baseURL}/events`).then((res) => res.json())
    },
    getUpcomingEvents: (date) => {
      return fetch(`${db.baseURL}/events/${date}`).then((res) => res.json())
    },
    postEvent: (jwt, newEvent) => {
      return fetch(`${db.baseURL}/events/newevent`, {
        method: 'POST',
        body: JSON.stringify(newEvent),
        headers: {
          Authorization: jwt.jwtToken,
        },
      }).then((res) => res.json())
    },
    deleteEvent: (jwt, id, img) =>
      fetch(`${db.baseURL}/events/dlt/${id}/${img}`, {
        method: 'DELETE',
        headers: {
          Authorization: jwt,
        },
      }).then((res) => res.json()),
  },
}

export default db
