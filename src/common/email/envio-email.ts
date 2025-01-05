// envio-email.ts
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
// Configuración del transporte SMTP
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Función para enviar correo
export function enviarCorreo(
  destinatario: string,
  asunto: string,
  datosFaltantes: string,
) {
  const mensajeHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 16px;">
      <h2 style="color: #4CAF50; text-align: center;">Notificación de Información Faltante</h2>
      <p>Estimado(a),</p>
      <p>Hemos detectado que falta información importante en su solicitud o registro. A continuación, se detalla:</p>
      <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #e3e3e3;">
        <li>${datosFaltantes}</li>
      </ul>
      <p>Por favor, proporcione esta información a la brevedad posible para evitar demoras.</p>
      <p>Si tiene alguna pregunta o necesita ayuda, no dude en responder a este correo.</p>
      <p>Gracias por su atención.</p>
      <p style="text-align: center; margin-top: 20px;">
        <strong>Equipo de Atención</strong><br/>
        <span style="font-size: 0.9em;">Legaliza Perú</span>
      </p>
    </div>
  `;

  const mensajeTexto = `
    Estimado(a),

    Hemos detectado que falta información importante en su solicitud o registro. Detalles de la información faltante:
    - ${datosFaltantes}

    Por favor, proporcione esta información a la brevedad posible para evitar demoras.

    Si tiene alguna pregunta o necesita ayuda, no dude en responder a este correo.

    Gracias por su atención.

    Equipo de Atención
    Legaliza Perú
  `;

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: destinatario,
    subject: asunto,
    text: mensajeTexto,
    html: mensajeHTML,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error al enviar el correo:', error);
    }
  });
}

// // Ejemplo de uso
// enviarCorreo(
//   'michelbalvinor@gmail.com',
//   'Información Faltante en su Solicitud',
//   'Nombre completo y número de teléfono', // Datos faltantes
// );
