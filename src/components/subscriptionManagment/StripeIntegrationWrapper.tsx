import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import React, { useCallback, useEffect } from 'react'
import StripeIntegrationSkeleton from "@/components/StripeIntegrationSkeleton";
import { AlertCircle, CreditCard } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button'; 
import { getStripeIntegrationStatusThunk } from '@/redux/thunk/stripeThunk';

const StripeIntegrationWrapper = () => {

    const dispatch = useAppDispatch()
    const { data, stripeError, isStripeLoading } = useAppSelector((state) => state.stripeIntegration)

    const fetchData = useCallback(async () => {
        try {
            await dispatch(getStripeIntegrationStatusThunk()).unwrap();

        } catch (error) {
            console.error("Failed to fetch subscription plans", error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, []);

    if (stripeError) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-400">Chcek your internet connections</p>
            </div>
        );
    }

    if (!data && !isStripeLoading) {
        return (
            <div className="bg-bg-card border border-border-primary rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <p className="text-sm text-text-tertiary">
                    No Stripe integration data available.
                </p>
            </div>
        );
    }

    return (
        <>
            {isStripeLoading ? <StripeIntegrationSkeleton /> : <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-accent-primary" />
                            Stripe Payment Integration
                        </h2>
                        <p className="text-sm text-text-tertiary mt-1">
                            Manage your Stripe payment gateway settings and connection
                        </p>
                    </div>

                    <StatusBadge
                        active={data!.apiStatus === "connected"}
                        activeText="Connected"
                        inactiveText="Disconnected"
                    />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-text-primary mb-3">Connection Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-tertiary">API Status</span>

                                <StatusBadge active={data!.apiStatus === "connected"} />

                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-tertiary">Webhook Status</span>
                                <StatusBadge active={data!.webhookStatus === "active"} />

                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-tertiary">Mode</span>
                                <div className="text-xs text-accent-primary font-medium capitalize border rounded-full px-2 py-1 border-border-accent flex items-center gap-1">
                                    {data!.mode !== "test" && (<div className="w-2 h-2 bg-yellow-400 rounded-full relative" > <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                                    </div>)}
                                    <span>  {data!.mode}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-text-primary mb-3">Payment Methods</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-tertiary">Credit Cards</span>
                                <StatusBadge active={data!.paymentMethods.creditCards} activeText="Enabled" inactiveText="Disabled" />

                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-tertiary">Bank Transfers</span>
                                <StatusBadge active={data!.paymentMethods.bankTransfer} activeText="Enabled" inactiveText="Disabled" />

                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-tertiary">Digital Wallets</span>
                                <StatusBadge active={data!.paymentMethods.digitalWallets} activeText="Enabled" inactiveText="Disabled" />

                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border-primary">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-text-primary mb-1">Stripe Dashboard</h3>
                            <p className="text-xs text-text-tertiary">
                                Access your Stripe dashboard to view detailed payment information, manage customers, and configure advanced settings.
                            </p>
                        </div>
                        <Button
                            type="default"
                            icon={<CreditCard className="w-4 h-4" />}
                            onClick={() => window.open("https://dashboard.stripe.com/test/dashboard", "_blank")}
                            className="!w-fit rounded-lg"
                        >
                            Open Stripe Dashboard
                        </Button>
                    </div>
                </div>

                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-medium text-yellow-400 mb-1">Integration Information:</p>
                        <p className="text-xs text-yellow-200">
                            All subscription payments, refunds, and cancellations are processed through Stripe.
                            Webhooks are configured to automatically sync subscription status changes with your platform.
                        </p>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default StripeIntegrationWrapper