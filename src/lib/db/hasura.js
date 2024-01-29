export async function findVideoIdByUser(token, videoId, userId) {
    const operationsDoc = `
    query findVideoIdByUser($userId: String!, $videoId: String!) {
        stats(where: {_and: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}}) {
            userId
            videoId
            watched
            favourited
            id
        }
    }
    `;

    const response = await queryHasuraGQL(
        operationsDoc,
        "findVideoIdByUser",
        {
            userId,
            videoId,
        },
        token,
    )

    return response?.data?.stats;
}

export async function insertStats(token, { userId, videoId, favourited, watched }) {
    const operationsDoc = `
    mutation insertStats($userId: String!, $videoId: String!, $favourited: Int!, $watched: Boolean!) {
        insert_stats_one(object: {userId: $userId, videoId: $videoId, favourited: $favourited, watched: $watched}) {
            userId
            videoId
            favourited
            watched
          }
    }
    `;

    return await queryHasuraGQL(
        operationsDoc,
        "insertStats",
        {
            userId,
            videoId,
            favourited,
            watched
        },
        token,
    )
}

export async function updateStats(token, { userId, videoId, favourited, watched }) {
    const operationsDoc = `
    mutation updateStats($userId: String!, $videoId: String!, $favourited: Int!, $watched: Boolean!) {
        update_stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}, _set: {favourited: $favourited, watched: $watched}) {
        returning {
            favourited
            userId
            videoId
            watched
        }
        }
    }
    `;

    return await queryHasuraGQL(
        operationsDoc,
        "updateStats",
        {
            userId,
            videoId,
            favourited,
            watched
        },
        token,
    )
}

export async function createNewUser(token, newUserMetadata) {
    const operationsDoc = `
    mutation createNewUser($email: String!, $issuer: String!, $publicAddress: String!) {
        insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
        returning {
            email
            issuer
            publicAddress
        }
        }
    }
    `;

    const { email, issuer, publicAddress } = newUserMetadata;
    const response = await queryHasuraGQL(
        operationsDoc,
        "createNewUser",
        {
            email,
            issuer,
            publicAddress,
        },
        token,
    )

    return response;
}

export async function isNewUserQuery(issuer, token) {
    const operationsDoc = `
    query isNewUserQuery($issuer: String!) {
        users(where: {issuer: {_eq: $issuer}}) {
        id
        email
        issuer
        publicAddress
        }
    }
    `;

    const response = await queryHasuraGQL(operationsDoc, "isNewUserQuery", { issuer }, token);

    return response?.data?.users?.length === 0;
}

export async function watchedVideos(token, userId) {
    const operationsDoc = `
    query watchedVideos($userId: String!) {
        stats(where: {userId: {_eq: $userId}, watched: {_eq: true}}) {
        videoId
        }
    }
    `;

    const response = await queryHasuraGQL(operationsDoc, "watchedVideos", { userId }, token);

    return response?.data?.stats;

}

export async function favouritedVideos(token, userId) {
    const operationsDoc = `
    query favouritedVideos($userId: String!) {
        stats(where: {userId: {_eq: $userId}, favourited: {_eq: 1}}) {
        videoId
        }
    }
    `;

    const response = await queryHasuraGQL(operationsDoc, "favouritedVideos", { userId }, token);

    return response?.data?.stats;

}

export async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
    const result = await fetch(
        process.env.NEXT_PUBLIC_HASURA_URL,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName
            })
        }
    );

    return await result.json();
};