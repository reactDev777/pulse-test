import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Wraps a Next.js route in order to return a friendly 500 error in case
 * an error happens
 *
 * @returns endpoint result or friendly 500 error if an error happens
 * @param handler
 */
export const errorWrapper =
    (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        return handler(req, res).catch((error) => {
            console.log('------');
            console.error(error);

            const { message = 'Something went wrong', isBoom, output } = error;
            if (isBoom) {
                return res.status(output.statusCode).json({
                    message,
                    success: false,
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || error,
            });
        });
    };
