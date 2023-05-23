import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from 'nookies'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { token, userType } = req.body;

  setCookie({ res }, 'token', String(token), {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  setCookie({ res }, 'userType', String(userType), {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return res.status(200).json({ token });

}