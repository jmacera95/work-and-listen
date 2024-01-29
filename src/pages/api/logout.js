import magicAdmin from "@/lib/magic-admin";
import { destroyCookie } from "@/lib/cookies";

const logout = async (req, res) => {
    if (req.method === "POST") {
        try {
            if (!req.cookies.token) {
                return res.status(401).json({ message: "User is not logged in" });
            }

            // destroy jwt cookie
            destroyCookie("token", res);
            try {
                const auth = req.headers.authorization;
                const token = auth ? auth.substr(7) : '';

                // Invoke Magic to logout the user
                await magicAdmin.users.logoutByToken(token); 
              } catch (error) {
                console.error("Error occurred while logging out magic user", error);
              }
              //redirects user to login page
              res.writeHead(302, { Location: "/login" });
              res.end();           
        } catch (error) {
            console.error("Something went wrong logging out", error);
            res.status(500);
            res.send({ error: "Something went wrong" });
        }
    } else {
        res.status(405);
        res.send({ error: "Method not allowed" });
    }
};

export default logout;