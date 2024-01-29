import { isNewUserQuery, createNewUser } from "@/lib/db/hasura";
import magicAdmin from "@/lib/magic-admin";
import { setTokenCookie } from "@/lib/cookies";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
    if (req.method === "POST") {
        try {
            const auth = req.headers.authorization;
            const token = auth ? auth.substr(7) : '';

            // Invoke Magic to get user's data, create JWT and send it to the client
            const userMetadata = await magicAdmin.users.getMetadataByToken(token);

            const jwtToken = jwt.sign({
                ...userMetadata,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
                "https://hasura.io/jwt/claims": {
                    "x-hasura-default-role": "user",
                    "x-hasura-allowed-roles": ["user", "admin"],
                    "x-hasura-user-id": `${userMetadata.issuer}`,
                },
            }, process.env.HASURA_JWT_SECRET);

            // Check if it is a new user and create it if is
            const isNewUser = await isNewUserQuery(userMetadata.issuer, jwtToken);
            isNewUser && await createNewUser(jwtToken, userMetadata);

            // set jwt cookie
            setTokenCookie(jwtToken, res);
            res.send({ done: true });
        } catch (error) {
            console.error("Something went wrong logging in", error);
            res.status(500);
            res.send({ error: "Something went wrong" });
        }
    } else {
        res.status(405);
        res.send({ error: "Method not allowed" });
    }
};

export default login;