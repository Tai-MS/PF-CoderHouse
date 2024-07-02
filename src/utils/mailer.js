import nodemailer from 'nodemailer'
import { constants } from '../utils'

export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 857,
    auth:{
        user: constants.USERMAILER,
        pass: constants.PASSMAILER
    }
})
