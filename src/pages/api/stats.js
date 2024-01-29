import { findVideoIdByUser, insertStats, updateStats } from "@/lib/db/hasura";
import { verifyToken } from "@/lib/utils";

const stats = async (req, res) => {
    if (["GET", "POST"].indexOf(req.method) == -1) {
        res.status(405);
        res.send({ error: "Method not allowed" });
    } else {
        try {
            const token = req.cookies.token;
            if (!token) {
                res.status(403).send({ message: "Unauthorized." });
            } else {
                const userId = await verifyToken(token);
                const videoId = req.query.videoId;

                if (videoId) {
                    const videoStats = await findVideoIdByUser(token, videoId, userId);
                    const doesStatsExist = videoStats?.length > 0;

                    if (req.method === "POST") {
                        const { favourited, watched = true } = req.body;
                        if (doesStatsExist) {
                            // update it
                            const updateStatsResponse = await updateStats(token, { userId, videoId, favourited, watched })
                            res.send({ data: updateStatsResponse });
                        } else {
                            // add it
                            const insertStatsResponse = await insertStats(token, { userId, videoId, favourited, watched })
                            res.send({ data: insertStatsResponse });
                        }
                    } else if (req.method === "GET") {
                        if (doesStatsExist) {
                            res.send({ videoStats });
                        } else {
                            res.status(404);
                            res.send({ videoStats: null, message: "Video stats not found." })
                        }
                    }
                } else {
                    res.status(400);
                    res.send({ error: "videoId is required." })
                }

            }
        } catch (error) {
            console.error("Error /api/stats, ", error);
            res.status(500).send({ message: "Ups, something went wrong.", error: error });
        }
    }
};

export default stats;