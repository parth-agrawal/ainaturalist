'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SMSSignup() {
    const [phone, setphone] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            setSubmitted(true);
        } catch (error) {
            console.error('Error registering:', error);
            // Handle error state here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Join AI Naturalist!</CardTitle>
                    <p className="text-center text-muted-foreground">
                        Get instant nature identifications and wildlife information via text
                    </p>
                </CardHeader>

                <CardContent>
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Phone Number
                                </label>
                                <Input
                                    type="tel"
                                    id="phone"
                                    placeholder="(555) 555-5555"
                                    value={phone}
                                    onChange={(e) => setphone(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Signing up...' : 'Sign up for SMS'}
                            </Button>

                            <p className="text-xs text-muted-foreground mt-4">
                                By submitting this form and signing up for texts, you consent to receive automated
                                nature identification messages from AI Naturalist. Message frequency varies based
                                on your queries. Msg & data rates may apply. Reply STOP anytime to unsubscribe.
                                See our{' '}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>{' '}
                                &{' '}
                                <Link href="/terms" className="text-primary hover:underline">
                                    Terms
                                </Link>
                                .
                            </p>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <p className="text-lg font-medium">
                                Thanks for signing up!
                            </p>
                            <p className="text-muted-foreground">
                                Text anything to (555) 555-5555 to start identifying nature around you.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}