const nodemailer=require("nodemailer")
const pug=require("pug")
const juice=require("juice")
const htmlToText=require("html-to-text")
const promosify=require("es6-promisify")
const transport=nodemailer.createTransport({
    host:process.env.MAIL_HOST,
    port:process.env.MAIL_PORT,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
    }
});
// transport.sendMail({
//     from:"Qi Liu <liuqi@ulda.edu>",
//     to:"randy@example.com",
//     subject:"Just trying things out!",
//     html:"Hey I <strong>love<strong> you",
//     text:"Hey I **love you**"
// })
const generateHTML=(filename,options={})=>{
    const html=pug.renderFile(`${__dirname}/../views/email/${filename}.pug`,options);
    return html
}
exports.send=async(options)=>{
    const html=generateHTML(options.filename,options)
    //需要text,因为html可能在其他的系统中显示不正确
    const text=htmlToText.fromString(html)
    const mainOptions={
        from:"Qi Liu <liuqi@ulda.edu>",
        to:options.user.email,
        subject:options.subject,
        html,
        text
    };
    const sendMail=promosify(transport.sendMail,transport)
    return sendMail(mainOptions)
}

