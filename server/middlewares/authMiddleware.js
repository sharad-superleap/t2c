import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401)
                .json(
                    {
                        success: false,
                        message: "Unauthorized request"
                    }
                )
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWTSECRETKEY
        )


        req.user = decoded;
        next();

    } catch (err) {
        return res.status(500)
            .json({
                success: false,
                message: "Invalid or expired token"
            })
    }
}