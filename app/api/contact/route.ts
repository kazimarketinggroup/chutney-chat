import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const type = data.type || 'enquiry';
    const name = data.name || 'Not provided';
    const email = data.email || 'Not provided';
    
    // Create Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Needs an App Password from Google
      },
    });

    let subject = '';
    let htmlContent = '';

    if (type === 'speaker') {
      const company = data.company || 'Not provided';
      const role = data.role || 'Not provided';
      const linkedIn = data.linkedIn || 'Not provided';
      const talkTopic = data.talkTopic || 'Not provided';
      const speakingExperience = data.speakingExperience || 'Not provided';

      subject = `New Speaker Pitch from ${name}`;
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #FF7B39 0%, #EE6422 100%); padding: 30px 20px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">New Speaker Application</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Chutney & Chat</p>
          </div>
          <div style="padding: 25px; background-color: #fafafa; border-bottom: 1px solid #eee;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #EE6422; text-decoration: none;">${email}</a></p>
            <p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${company}</p>
            <p style="margin: 0 0 10px 0;"><strong>Role:</strong> ${role}</p>
            <p style="margin: 0;"><strong>LinkedIn:</strong> <a href="${linkedIn}" style="color: #EE6422; text-decoration: none;">View Profile</a></p>
          </div>
          <div style="padding: 25px; background-color: #ffffff;">
            <h3 style="color: #121212; margin: 0 0 10px 0; font-size: 16px;">Proposed Topic / Title</h3>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eaeaea; margin-bottom: 25px;">
              <p style="margin: 0; font-size: 15px;">${talkTopic}</p>
            </div>
            
            <h3 style="color: #121212; margin: 0 0 10px 0; font-size: 16px;">Speaking Experience</h3>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eaeaea;">
              <p style="margin: 0; font-size: 14px; white-space: pre-wrap;">${speakingExperience}</p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; background-color: #f1f1f1; font-size: 12px; color: #888;">
            This email was automatically generated from the Chutney & Chat website.
          </div>
        </div>
      `;
    } else {
      const phone = data.phone || 'Not provided';
      const message = data.message || 'Not provided';

      subject = `New General Enquiry from ${name}`;
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #444 0%, #121212 100%); padding: 30px 20px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">New General Enquiry</h2>
            <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0; font-size: 14px;">Chutney & Chat</p>
          </div>
          <div style="padding: 25px; background-color: #fafafa; border-bottom: 1px solid #eee;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #EE6422; text-decoration: none;">${email}</a></p>
            <p style="margin: 0;"><strong>Phone:</strong> ${phone}</p>
          </div>
          <div style="padding: 25px; background-color: #ffffff;">
            <h3 style="color: #121212; margin: 0 0 10px 0; font-size: 16px;">Message</h3>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eaeaea;">
              <p style="margin: 0; font-size: 14px; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; background-color: #f1f1f1; font-size: 12px; color: #888;">
            This email was automatically generated from the Chutney & Chat website.
          </div>
        </div>
      `;
    }

    // Send Mail
    await transporter.sendMail({
      from: `"Chutney & Chat Forms" <${process.env.EMAIL_USER}>`,
      to: 'officialmdmahadi@gmail.com',
      replyTo: email,
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('API Email Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
}
