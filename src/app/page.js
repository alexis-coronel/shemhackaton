"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import { ArrowLeftFromLine, ArrowRightToLine, BookHeart, ChevronLeft, FileQuestion, LogOut, User } from "lucide-react";
import Auth from "./components/auth/Auth";
import { supabase } from "./lib/supabase";
import CrearMemoria from "./components/CrearMemoria";
import CrearPregunta from "./components/CrearPregunta";



export default function Home() {
  const pedirmemories = async () => {
    const { data: memorias, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    return { memorias, error }
  }

  const pedirquestions = async () => {
    const { data: preguntas, error } = await supabase
      .from('questions')
      .select(`
      *,
      target:target_id (
        nick
      )
    `)
      .eq('asked_by', user?.id)
      .order('created_at', { ascending: false });

    return { preguntas, error };
  }

  const { user, signOut } = useAuth();
  const [opciones, setOpciones] = useState(true)
  const [show, setShow] = useState(false)
  const [preguntas, setPreguntas] = useState(false)
  const [memorias, setMemorias] = useState([])
  const [questions, setQuestions] = useState([])
  const [newnote, setNewnote] = useState(false)
  const [newQuestion, setNewQuestion] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [preguntaRespondida, setPreguntaRespondida] = useState(null)
  const [infoNote, setInfoNote] = useState(null)
  const [infoQuestion, setInfoQuestion] = useState(null)

  const validacionPeticion = () => {
    if (!preguntas) {
      pedirmemories().then(response => { setMemorias(response.memorias) })
      setMensaje('')
    }
    if (preguntas) {
      pedirquestions().then(responseq => { setQuestions(responseq.preguntas) })
      setMensaje('')
    }
  }
  useEffect(() => {
    setInfoQuestion(null)
    setInfoNote(null)
    setNewQuestion(false)
    setNewnote(false)
  }, [user])

  useEffect(() => {
    if (user?.id) {
      if(mensaje === "Memoria guardada con éxito."){
        validacionPeticion()
      }else if(questions.length < 1){
        validacionPeticion()
      }
      else if(memorias.length < 1){
        validacionPeticion()
      }
    }
    if(user===null){
      setMemorias([])
      setQuestions([])
    }
  }, [preguntas, user])

  useEffect(() => {
    if (mensaje === "Memoria guardada con éxito.") {
      validacionPeticion()
    }
    if(preguntaRespondida){
      validacionPeticion()
      setPreguntaRespondida('')
    }
  }, [newQuestion, newnote,preguntaRespondida])

  return (
    <>
      <Navbar />
      <div className="w-[100vw] h-[100vh] overflow-hidden flex">
        <div className={`bg-[#005187] transition-all delay-50 duration-250 ease-in-out overflow-hidden flex flex-col p-3 justify-between h-[calc(100vh-24px)] ${opciones ? 'w-[30%]' : 'w-[5%]'}`}>
          <div className="flex flex-col gap-3">
            <button className="w-[100%] flex justify-end cursor-pointer" onClick={() => setOpciones(op => !op)}>{opciones ? <ArrowLeftFromLine width={'30px'} /> : <ArrowRightToLine width={'30px'} />}</button>
            <button onClick={() => { setPreguntas(false); setNewQuestion(false); setNewnote(false) }} className="flex justify-start items-center gap-3 cursor-pointer"><BookHeart width={'30px'} /> {opciones && 'Mis notas'}</button>
            <button onClick={() => { setPreguntas(true); setNewQuestion(false); setNewnote(false) }} className="flex justify-start items-center gap-3 cursor-pointer"><FileQuestion width={'30px'} /> {opciones && 'Mis preguntas'}</button>
          </div>
          <div className="flex flex-col gap-3">




            {user === null ?
              <>
                <button className="flex flex-col cursor-pointer justify-start items-center gap-3" onClick={() => setShow(true)}>
                  <User  width={'30px'}/> {opciones && 'Inicia session'}
                </button>
                {show && <Auth cerrar={setShow} width={'30px'} />}
              </>
              :
              <>
                <button className="flex flex-col cursor-pointer justify-start items-center gap-3"><User width={'30px'} /> {opciones && `${user?.email}`}</button>
                {<button className="flex cursor-pointer justify-start items-center gap-3" onClick={signOut}><LogOut color="red" width={'30px'} /> {opciones && 'Salir'}</button>}

              </>
            }


          </div>
        </div>
        <div className={`transition-all delay-50 duration-250 ease-in-out overflow-y-scroll h-[calc(100vh-24px)] bg-gradient-to-br from-[#0b0c10] via-[#1f2833] to-[#0b0c10] shadow-[inset_0_0_40px_#45a29e66] text-[#c5c6c7] border border-[#45A29E33] backdrop-blur-md ${newnote || newQuestion || infoQuestion?.question || infoNote?.content ? 'w-[0%]' : 'w-full p-3'}`}>
          <div className="w-full flex justify-center sticky bg-[#171717] left-0 top-0 bg-gradient-to-br from-[#0b0c10] via-[#1f2833] to-[#0b0c10] shadow-[inset_0_0_40px_#45a29e66] text-[#c5c6c7] border border-[#45A29E33] backdrop-blur-md mb-3">
            <span className="text-center">
              Estás son tus {preguntas ? 'Preguntas:' : 'Notas:'}
            </span>
          </div>

          {!preguntas && (
            <div className="flex flex-wrap gap-3">
              <button onClick={() => {!user?setShow(true):setNewnote(true)}} className="border-[3px] cursor-pointer border-[#008712] rounded-[10px] p-2 w-fit">
                agregar una nota/pensamiento
              </button>
              {memorias.length > 0 &&
                memorias.map((me) => (
                  <button onClick={()=>setInfoNote(me)} className="border-[3px] cursor-pointer border-[#005187] rounded-[10px] p-2 w-fit" key={me.id}>
                    {me.title}
                  </button>
                ))}
            </div>
          )}

          {preguntas && (
            <div className="flex flex-wrap gap-3">
              <button onClick={() => {!user?setShow(true):setNewQuestion(true)}} className="border-[3px] cursor-pointer border-[#008712] rounded-[10px] p-2 w-fit">
                Hacer una pregunta
              </button>
              {questions.length > 0 &&
                questions.map((que) => (
                  <button onClick={()=>{setInfoQuestion(que)}} className="border-[3px] cursor-pointer border-[#005187] rounded-[10px] p-2 w-fit" key={que.id}>
                    {que.question}
                  </button>
                ))}
            </div>
          )}
        </div>
        <div className={`transition-all delay-50 duration-250 ease-in-out overflow-hidden h-[calc(100vh-24px)] bg-gradient-to-br from-[#0b0c10] via-[#1f2833] to-[#0b0c10] shadow-[inset_0_0_40px_#45a29e66] text-[#c5c6c7] border border-[#45A29E33] backdrop-blur-md ${newnote ? 'w-full p-3' : 'w-0'}`}>
          <div className="flex items-center">
            <button className="border-[3px] cursor-pointer border-[#870000] rounded-[10px] p-2 w-fit flex" onClick={() => setNewnote(false)}> <ChevronLeft color="white" />Volver</button><span className="text-center flex justify-center w-full">Agrega una nueva nota/pensamiento</span>
          </div>
          <CrearMemoria setMensaje={setMensaje} mensaje={mensaje} />
        </div>
        <div className={`transition-all delay-50 duration-250 ease-in-out overflow-hidden h-[calc(100vh-24px)] bg-gradient-to-br from-[#0b0c10] via-[#1f2833] to-[#0b0c10] shadow-[inset_0_0_40px_#45a29e66] text-[#c5c6c7] border border-[#45A29E33] backdrop-blur-md ${newQuestion ? 'w-full p-3' : 'w-0'}`}>
          <div className="flex items-center">
            <button className="border-[3px] cursor-pointer border-[#870000] rounded-[10px] p-2 w-fit flex" onClick={() => setNewQuestion(false)}> <ChevronLeft color="white" />Volver</button><span className="text-center flex justify-center w-full">Crea una nueva pregunta</span>
          </div>
        <CrearPregunta setPreguntaRespondida={setPreguntaRespondida} preguntaRespondida={preguntaRespondida}/></div>
      <div className={`transition-all delay-50 duration-250 ease-in-out overflow-hidden h-[calc(100vh-24px)] bg-gradient-to-br from-[#0b0c10] via-[#1f2833] to-[#0b0c10] shadow-[inset_0_0_40px_#45a29e66] text-[#c5c6c7] border border-[#45A29E33] backdrop-blur-md ${infoQuestion?.question ? 'w-full p-6' : 'w-0'}`}>
  <div className="flex items-center mb-6">
    <button
      className="border-[2px] border-[#45A29E] hover:bg-[#1f2833] text-[#66FCF1] font-medium rounded-lg px-4 py-2 transition duration-200 flex items-center gap-2"
      onClick={() => setInfoQuestion(null)}
    >
      <ChevronLeft size={20} />
      Volver
    </button>
  </div>

  <div className="space-y-4 px-1">
    <div className="text-[13px] uppercase text-[#66fcf1] tracking-wide">Respondió:</div>
    <div className="text-[16px] font-semibold text-[#ffffffbb] italic">&ldquo;{infoQuestion?.target.nick}&rdquo;</div>

    <div className="text-[13px] uppercase text-[#66fcf1] tracking-wide mt-4">Tu pregunta:</div>
    <div className="text-[15px] text-[#C5C6C7] border-l-4 border-[#66FCF1] pl-4 italic">
      {infoQuestion?.question}
    </div>

    <div className="text-[13px] uppercase text-[#66fcf1] tracking-wide mt-6">Su respuesta:</div>
    <div className="text-[15px] text-[#ffffffcc] border-l-4 border-[#45A29E] pl-4">
      {infoQuestion?.response}
    </div>
  </div>
</div>
      <div className={`transition-all delay-50 duration-250 ease-in-out overflow-hidden h-[calc(100vh-24px)] bg-gradient-to-br from-[#0b0c10] via-[#1f2833] to-[#0b0c10] shadow-[inset_0_0_40px_#45a29e66] text-[#c5c6c7] border border-[#45A29E33] backdrop-blur-md ${infoNote?.content ? 'w-full p-6' : 'w-0'}`}>
  <div className="flex items-center mb-6">
    <button
      className="border-[2px] border-[#45A29E] hover:bg-[#1f2833] text-[#66FCF1] font-medium rounded-lg px-4 py-2 transition duration-200 flex items-center gap-2"
      onClick={() => setInfoNote(null)}
    >
      <ChevronLeft size={20} />
      Volver
    </button>
  </div>

  <div className="space-y-4 px-1">

    <div className="text-[13px] uppercase text-[#66fcf1] tracking-wide mt-4">Titulo:</div>
    <div className="text-[15px] text-[#C5C6C7] border-l-4 border-[#66FCF1] pl-4 italic">
      {infoNote?.title}
    </div>

    <div className="text-[13px] uppercase text-[#66fcf1] tracking-wide mt-6">contenido:</div>
    <div className="text-[15px] text-[#ffffffcc] border-l-4 border-[#45A29E] pl-4">
      {infoNote?.content}
    </div>
    <div className="text-[13px] uppercase text-[#66fcf1] tracking-wide mt-6">¿Esta publico?:</div>
    <div className="text-[15px] text-[#ffffffcc] border-l-4 border-[#45A29E] pl-4">
      {infoNote?.is_public? 'Es publico': 'Es privado'}
    </div>
  </div>
</div>

      </div>
    </>
  );
}
