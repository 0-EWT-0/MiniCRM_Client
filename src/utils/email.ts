import emailjs from 'emailjs-com'

export async function sendLeadEmail({
  to_name,
  to_email,
  lead_name,
  lead_email,
  lead_number,
}: {
  to_name: string
  to_email: string
  lead_name: string
  lead_email: string
  lead_number: string
}) {
  try {
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID!,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
      {
        to_name,
        to_email,
        lead_name,
        lead_email,
        lead_number,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY!,
    )
    return result
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error)
    throw error
  }
}
