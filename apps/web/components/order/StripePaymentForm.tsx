'use client';

import {
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

interface StripePaymentFormProps {
    total: number;
}

export function StripePaymentForm({ total }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const t = useTranslations('order');
    const params = useParams();
    const locale = params.locale as string;

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/${locale}/order/confirmation`,
            },
        });

        // confirmPayment only reaches here if there's an immediate error
        if (error) {
            setErrorMessage(error.message ?? t('checkout.paymentError'));
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />

            {errorMessage && (
                <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
            )}

            <button
                type="submit"
                disabled={!stripe || !elements || isProcessing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-active disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Lock className="h-4 w-4" />
                {isProcessing
                    ? t('checkout.processing')
                    : `${t('checkout.pay')} — ${total.toFixed(2).replace('.', ',')}€`}
            </button>
        </form>
    );
}
