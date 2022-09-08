import nodemailer from 'nodemailer'

const emailRegistro = async(datos)=>{
    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {

          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        
        }
      });

      const {email, nombre, token} = datos;

      //Enviar el mail
      await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta para poder loguearte en BienesRaices.com',
        html:`
            <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>
            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a> </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</pa>
        `
      })
}

const emailOlvidePassword = async(datos)=>{
    
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {

        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      
      }
    });

    const {email, nombre, token} = datos;

    //Enviar el mail
    await transport.sendMail({
      from: 'BienesRaices.com',
      to: email,
      subject: 'Reestablece tu contraseña en BienesRaices.com',
      text: 'Confirma tu cuenta para poder loguearte en BienesRaices.com',
      html:`
          <p>Hola ${nombre}, has solicitado reestablecer tu contraseña en bienesRaices.com</p>
          <p>Haz click en este enlace para reestablecer tu contraseña: 
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Reestablecer contraseña</a> </p>

          <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje</pa>
      `
    })
}

export{
    emailRegistro,
    emailOlvidePassword
}