const models = require('../models');

export function createStatsLogin(user_id) {

    return new Promise<void>((resolve, reject) => {
        if (!user_id) {
            reject('user_id can not be null')
        }

        models.StatsLogin.create({
            user_id: user_id,
            login_at: new Date()
        })
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err);
            })
    })
}

export function retrieveRecentLogin(user_id) {

    return new Promise<void>((resolve, reject) => {
        if (!user_id) {
            reject('user_id can not be null')
        }

        models.StatsLogin.max('login_at', {
            where: { user_id: user_id }
        })
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err);
            })
    })
}
