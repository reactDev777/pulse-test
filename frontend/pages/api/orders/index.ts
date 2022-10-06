import type { NextApiRequest, NextApiResponse } from 'next';
import { errorWrapper } from '~/lib/helpers/errorWrapper';

import Order from '~/lib/models/order';
import { connectMongo } from '~/lib/util/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await connectMongo();
    if (req.method === 'GET') {
        const orders = Order.find();
        return res.status(200).json({ orders });
    } else if (req.method === 'POST') {
        const order = new Order({
            side: req.body.side,
            size: req.body.size,
            filled: req.body.filled,
            price: req.body.price,
            fee: req.body.fee,
            status: req.body.status,
            time: new Date().toISOString(),
        });

        await order.save();

        return res.status(200).json(order);
    }
};

export default errorWrapper(handler);
