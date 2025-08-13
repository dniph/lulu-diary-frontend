"use client";
import { useState, useEffect } from 'react';
import FriendsSystem from '@/components/FriendsSystem';

export default function FriendsPage() {
	const [currentUser, setCurrentUser] = useState(null);
	useEffect(() => {
		async function fetchCurrentUser() {
			try {
				const response = await fetch('/api/lulu-diary/me', { credentials: 'include' });
				if (response.ok) {
					const userData = await response.json();
					setCurrentUser(userData);
				}
			} catch (error) {
				setCurrentUser(null);
			}
		}
		fetchCurrentUser();
	}, []);

	if (!currentUser) {
		return <div className="min-h-screen flex items-center justify-center font-pixel text-lg">Cargando usuario...</div>;
	}

	return (
		<div className="min-h-screen bg-cover bg-center bg-no-repeat relative font-pixel bg-fixed" style={{backgroundImage: "url('/images/CIELO PIXEL ART.png')"}}>
			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8">👥 Amigos</h1>
				<FriendsSystem username={currentUser.username} currentUserId={currentUser.id} isOwnProfile={true} />
			</div>
		</div>
	);
}
