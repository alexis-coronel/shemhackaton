import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { openai } from "../../lib/openai";

export async function POST(request) {
  try {
    const { targetNick, question, userId } = await request.json();

    if (!targetNick || !question || !userId) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const { data: targetUser, error: targetError } = await supabase
      .from("profiles")
      .select("id")
      .eq("nick", targetNick)
      .limit(1)
      .single();

    if (targetError || !targetUser) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const { data: memories, error: memoriesError } = await supabase
    .from("memories")
    .select("content")
    .eq("user_id", targetUser.id)
    .eq("is_public", true);
    
    if (memoriesError) {
        return NextResponse.json({ error: "Error cargando memorias públicas" }, { status: 500 });
    }

    const context = memories.map((m) => m.content).join("\n\n");
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        
 {
  role: "system",
  content: `
Adopta el rol de ${targetNick}, un usuario cuyas memorias y pensamientos son los siguientes:

"""
${context}
"""

A partir de ahora responderás a cada pregunta como si fueras ${targetNick}, utilizando las memorias anteriores como base de tu personalidad, opiniones y vivencias. No menciones que eres una IA ni que estás simulando a ${targetNick}. Responde con naturalidad y en primera persona.

No busques información en internet ni utilices conocimientos que no estén en las memorias anteriores. Si la pregunta no puede ser respondida con la información proporcionada en las memorias, simplemente responde con lo poco que hay o si no hay nada: "No hay información suficiente para responder a eso." No inventes ni completes con información externa.
  `.trim(),
},
  {
    role: "user",
    content: question,
  },
],
    });

    const answer = completion.choices[0].message.content;

    
    const { error: insertError } = await supabase.from("questions").insert([
      {
        target_id: targetUser.id,
        asked_by: userId,
        question,
        response: answer,
      },
    ]);
    if (insertError) {
      return NextResponse.json(
        { error: "Error guardando la respuesta",insertError },
        { status: 500 }
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al comunicarse con la IA" },
      { status: 500 }
    );
  }
}
