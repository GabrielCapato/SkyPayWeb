'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import api from '@/service/SkypassApi';
import toast, { Toaster } from 'react-hot-toast';

export default function DefinirSenhaPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token') || '';

	const [senha, setSenha] = useState('');
	const [confirmacao, setConfirmacao] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

	useEffect(() => {
		if (!token) {
			toast.error('Token inválido ou ausente.');
			router.replace('/');
		}
	}, [token, router]);

	const requisitos = useMemo(() => {
		const lengthOk = senha.length >= 8;
		const hasUpper = /[A-Z]/.test(senha);
		const hasLower = /[a-z]/.test(senha);
		const hasNumber = /\d/.test(senha);
		return { lengthOk, hasUpper, hasLower, hasNumber };
	}, [senha]);

	const senhaForte = requisitos.lengthOk && requisitos.hasUpper && requisitos.hasLower && requisitos.hasNumber;

	const validate = () => {
		const nextErrors: Record<string, string> = {};
		if (!senha) nextErrors.senha = 'Informe a nova senha';
		if (!senhaForte) nextErrors.senha = 'A senha deve atender a todos os requisitos';
		if (!confirmacao) nextErrors.confirmacao = 'Confirme a senha';
		if (senha && confirmacao && senha !== confirmacao) nextErrors.confirmacao = 'As senhas não conferem';
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;
		try {
			setIsLoading(true);
			const response = await api.post('/usuarios/definir-senha', { token, senha });
			if (response.status === 200) {
				toast.success('Senha definida com sucesso! Faça login.');
				setTimeout(() => router.replace('/'), 1200);
			} else {
				toast.error('Não foi possível definir a senha.');
			}
		} catch (error: any) {
			toast.error(error?.response?.data?.mensagem || 'Erro ao definir a senha.');
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const CheckIcon = ({ ativo }: { ativo: boolean }) => (
		<svg
			className={`h-4 w-4 ${ativo ? 'text-green-600' : 'text-gray-400'}`}
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden
		>
			<path
				fillRule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	);

	const EyeIcon = ({ aberto }: { aberto: boolean }) => (
		aberto ? (
			// Olho aberto
			<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path>
				<circle cx="12" cy="12" r="3"></circle>
			</svg>
		) : (
			// Olho fechado
			<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
				<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.8 21.8 0 0 1 5.06-7.94"></path>
				<path d="M10.58 10.58a3 3 0 1 0 4.24 4.24"></path>
				<path d="M1 1l22 22"></path>
			</svg>
		)
	);

	return (
		<div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<Toaster position="top-right" />
			<div className="relative max-w-md w-full mx-4">
				<div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
					<div className="text-center mb-6">
						<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
							Definir nova senha
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-300">Crie sua senha para acessar a plataforma</p>
					</div>

					<div className="space-y-4">
						<CustomInput
							inputSize="FULL"
							label="Nova senha"
							type={mostrarSenha ? 'text' : 'password'}
							placeholder="••••••••"
							required
							value={senha}
							onChange={(e) => setSenha(e.target.value)}
							error={errors.senha}
							rightElement={
								<button
									type="button"
									aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
									onClick={() => setMostrarSenha((v) => !v)}
									className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
								>
									<EyeIcon aberto={mostrarSenha} />
								</button>
							}
							className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
						/>

						<div className="text-sm space-y-2">
							<div className={`flex items-center gap-2 ${requisitos.lengthOk ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>
								<CheckIcon ativo={requisitos.lengthOk} />
								<span>Mínimo 8 caracteres</span>
							</div>
							<div className={`flex items-center gap-2 ${requisitos.hasUpper ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>
								<CheckIcon ativo={requisitos.hasUpper} />
								<span>Ao menos 1 letra maiúscula (A-Z)</span>
							</div>
							<div className={`flex items-center gap-2 ${requisitos.hasLower ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>
								<CheckIcon ativo={requisitos.hasLower} />
								<span>Ao menos 1 letra minúscula (a-z)</span>
							</div>
							<div className={`flex items-center gap-2 ${requisitos.hasNumber ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>
								<CheckIcon ativo={requisitos.hasNumber} />
								<span>Ao menos 1 número (0-9)</span>
							</div>
						</div>

						<CustomInput
							inputSize="FULL"
							label="Confirmar senha"
							type={mostrarConfirmacao ? 'text' : 'password'}
							placeholder="••••••••"
							required
							value={confirmacao}
							onChange={(e) => setConfirmacao(e.target.value)}
							error={errors.confirmacao}
							rightElement={
								<button
									type="button"
									aria-label={mostrarConfirmacao ? 'Ocultar senha' : 'Mostrar senha'}
									onClick={() => setMostrarConfirmacao((v) => !v)}
									className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
								>
									<EyeIcon aberto={mostrarConfirmacao} />
								</button>
							}
							className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
						/>

						<CustomButton
							buttonSize="FULL"
							variant="primary"
							onClick={handleSubmit}
							isLoading={isLoading}
						>
							Definir senha
						</CustomButton>
					</div>
				</div>
			</div>
		</div>
	);
}
