import express from "express";

export function healthCheck(req: express.Request, res: express.Response)
{
    req;

    // res.status(200).json({success: true});
    res.send('Hello Router,<br><img src="public/0.jpg"/>');
}