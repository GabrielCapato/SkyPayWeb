'use client'
import Image from "next/image";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomSelect from "@/components/CustomSelect";
import { useState } from "react";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");

  const options = [
    { value: "1", label: "Opção 1" },
    { value: "2", label: "Opção 2" },
    { value: "3", label: "Opção 3" },
    { value: "4", label: "Opção 4" },
    { value: "5", label: "Opção 5" },
  ];

  const manyOptions = [
    ...options,
    { value: "6", label: "Opção 6" },
    { value: "7", label: "Opção 7" },
    { value: "8", label: "Opção 8" },
    { value: "9", label: "Opção 9" },
    { value: "10", label: "Opção 10" },
    { value: "11", label: "Opção 11" },
    { value: "12", label: "Opção 12" },
    { value: "13", label: "Opção 13" },
    { value: "14", label: "Opção 14" },
    { value: "15", label: "Opção 15" },
  ];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Exemplos de Select</h2>
          
          <CustomSelect
            label="Select Padrão"
            options={options}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Selecione uma opção"
          />
          
          <CustomSelect
            label="Select com Busca"
            options={manyOptions}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Busque e selecione uma opção"
            searchable
          />
          
          <CustomSelect
            label="Select com Erro"
            options={options}
            value={selectedValue}
            onChange={setSelectedValue}
            error="Este campo é obrigatório"
            required
          />
          
          <CustomSelect
            label="Select com Busca"
            options={options}
            value={selectedValue}
            onChange={setSelectedValue}
            searchable
          />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Exemplos de Inputs</h2>
          
          <CustomInput
            inputSize="SM"
            label="Input Pequeno"
            placeholder="Digite algo..."
          />
          
          <CustomInput
            inputSize="MD"
            label="Input Médio"
            placeholder="Digite algo..."
          />
          
          <CustomInput
            inputSize="LG"
            label="Input Grande"
            placeholder="Digite algo..."
          />
          
          <CustomInput
            inputSize="XL"
            label="Input Extra Grande"
            placeholder="Digite algo..."
          />
          
          <CustomInput
            inputSize="FULL"
            label="Input Largura Total"
            placeholder="Digite algo..."
          />
          
          <CustomInput
            inputSize="MD"
            label="Input com Erro"
            error="Este campo é obrigatório"
            placeholder="Digite algo..."
          />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Exemplos de Botões</h2>
          
          <div className="flex flex-wrap gap-4">
            <CustomButton buttonSize="SM" variant="primary">
              Botão Pequeno
            </CustomButton>
            
            <CustomButton buttonSize="MD" variant="secondary">
              Botão Médio
            </CustomButton>
            
            <CustomButton buttonSize="LG" variant="outline">
              Botão Grande
            </CustomButton>
            
            <CustomButton buttonSize="XL" variant="ghost">
              Botão Extra Grande
            </CustomButton>
          </div>

          <CustomButton buttonSize="FULL" variant="primary">
            Botão Largura Total
          </CustomButton>

          <div className="flex flex-wrap gap-4">
            <CustomButton buttonSize="MD" variant="primary" isLoading>
              Carregando
            </CustomButton>
            
            <CustomButton buttonSize="MD" variant="primary" disabled>
              Desabilitado
            </CustomButton>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
