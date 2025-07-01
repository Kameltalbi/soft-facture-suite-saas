
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DemoRequestData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  position?: string;
  message?: string;
  wantsCallback: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const demoData: DemoRequestData = await req.json();
    
    console.log("Demo request received:", demoData);

    // Email HTML template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #6A9C89; border-bottom: 2px solid #6A9C89; padding-bottom: 10px;">
          Nouvelle demande de démonstration SoftFacture
        </h1>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Informations du prospect :</h2>
          
          <p><strong>Nom complet :</strong> ${demoData.fullName}</p>
          <p><strong>Email :</strong> ${demoData.email}</p>
          <p><strong>Téléphone :</strong> ${demoData.phone}</p>
          <p><strong>Entreprise :</strong> ${demoData.company}</p>
          ${demoData.position ? `<p><strong>Fonction :</strong> ${demoData.position}</p>` : ''}
          
          <p><strong>Souhaite être rappelé :</strong> ${demoData.wantsCallback ? 'Oui' : 'Non'}</p>
          
          ${demoData.message ? `
            <div style="margin-top: 20px;">
              <strong>Message ou besoins spécifiques :</strong>
              <div style="background-color: white; padding: 15px; border-left: 4px solid #6A9C89; margin-top: 10px;">
                ${demoData.message}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div style="background-color: #e8f5f3; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; color: #666;">
            <strong>Prochaines étapes :</strong> Contactez ce prospect dans les 24h pour planifier la démonstration.
          </p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #888; font-size: 14px; text-align: center;">
          Email automatique généré par le formulaire de demande de démo SoftFacture
        </p>
      </div>
    `;

    // Send email to your team
    const emailResponse = await resend.emails.send({
      from: "SoftFacture Demo <onboarding@resend.dev>",
      to: ["contact@softfacture.com"], // Remplacez par votre vraie adresse email
      subject: `Nouvelle demande de démo - ${demoData.company} (${demoData.fullName})`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Demande de démo envoyée avec succès",
        emailId: emailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-demo-request function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erreur lors de l'envoi de la demande" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
