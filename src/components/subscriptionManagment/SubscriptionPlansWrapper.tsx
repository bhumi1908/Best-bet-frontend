import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { useFormik } from 'formik';
import { zodFormikValidate } from '@/utilities/zodFormikValidate';
import { createSubscriptionPlanSchema } from '@/utilities/schema';
import { createSubscriptionPlanThunk, getAllSubscriptionPlansAdminThunk, toggleSubscriptionPlanStatusThunk, updateSubscriptionPlanThunk } from '@/redux/thunk/subscriptionPlanThunk';
import { toast } from 'react-toastify';
import { Popup } from '../ui/Popup';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { AlertCircle, Check, Edit, MoreVertical, Plus, X } from 'lucide-react';
import { Switch } from '../ui/Switch';
import PricingCardSkeleton from '../PricingCardSkeleton';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '../ui/Dropdown';
import { cn } from '@/lib/utils';
import { togglePlanActiveStatus } from '@/redux/slice/subscriptionPlanSlice';
import { motion } from "framer-motion";


interface Feature {
    id?: string;
    name: string;
}

export interface SubscriptionPlan {
    id?: string | number;
    name: string
    price?: number
    duration?: number
    description: string
    isRecommended: boolean
    isActive: boolean
    features: Feature[]
    isTrial?: boolean;
    trialDays?: number;
    discountPercent?: number;
}

export const SubscriptionPlansWrapper = () => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
    // const [deletePlanDialogOpen, setDeletePlanDialogOpen] = useState(false);
    // const [deletePlan, setDeletePlan] = useState<DeletePlan | null>(null);

    const dispatch = useAppDispatch()
    const { error, isLoading, plans: subscriptionPlan } = useAppSelector((state) => state.subscriptionPlan)

    const initialValues: SubscriptionPlan & { isTrial: boolean } = {
        name: selectedPlan?.name || "",
        description: selectedPlan?.description || "",
        price: selectedPlan?.trialDays ? undefined : selectedPlan?.price || undefined,
        duration: selectedPlan?.trialDays ? undefined : selectedPlan?.duration || 1,
        isTrial: selectedPlan?.trialDays ? true : false,
        trialDays: selectedPlan?.trialDays ?? 0,
        features:
            selectedPlan?.features?.map(f => ({ name: f.name })) ?? [{ name: "" }],
        isActive: selectedPlan?.isActive ?? true,
        isRecommended: selectedPlan?.isRecommended ?? false,
        discountPercent: selectedPlan?.discountPercent ?? 0
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validate: zodFormikValidate(createSubscriptionPlanSchema),

        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const payload = {
                    ...values,
                    price: values.isTrial ? undefined : values.price,
                    duration: values.isTrial ? undefined : values.duration,
                    trialDays: values.isTrial ? 14 : undefined,
                    features: values?.features?.map((f) => ({
                        name: f.name,
                    })),
                };

                if (selectedPlan?.id) {
                    // EDIT 
                    await dispatch(
                        updateSubscriptionPlanThunk({
                            id: selectedPlan.id!,
                            payload,
                        })
                    ).unwrap();
                    setSelectedPlan(null)
                    toast.success("Plan edited successfully");
                } else {
                    // CREATE
                    await dispatch(createSubscriptionPlanThunk(payload)).unwrap();
                    toast.success("Plan created successfully");
                }
                setDialogOpen(false);
                resetForm();
            } catch (err: any) {
                toast.error(err.message)
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCancel = () => {
        setSelectedPlan(null)
        setDialogOpen(false);
        resetForm()
    }

    const handleEditPlan = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan)
        setDialogOpen(true);
    };

    // const handleIsActivePlan = (plan: SubscriptionPlan) => {
    //     try {
    //         const payload = {
    //             ...plan,
    //             isActive: !plan.isActive
    //         }
    //         dispatch(updateSubscriptionPlanThunk({ id: plan.id!, payload })).unwrap();
    //         toast.success(`Plan is ${!plan.isActive ? 'Activated' : 'Deactivated'}`)
    //     } catch (error: any) {
    //         toast.error(error.message || "Something went wrong...")

    //     }
    // }

    const handleIsActivePlan = async (plan: SubscriptionPlan) => {
        try {
            await dispatch(
                toggleSubscriptionPlanStatusThunk(Number(plan.id!))
            ).unwrap();

            toast.success(
                `Plan ${plan.isActive ? 'Deactivated' : 'Activated'} successfully`
            );
        } catch (err: any) {
            toast.error(err.message || 'Failed to update plan status');
        }
    };



    // const handleDeletePlan = async () => {
    //   if (!deletePlan?.id) return;

    //   try {
    //     await dispatch(deleteSubscriptionPlanThunk(deletePlan.id)).unwrap();
    //     setDeletePlanDialogOpen(false);
    //     setDeletePlan(null);
    //     toast.success("Plan deleted successfully");
    //   } catch (error: any) {
    //     toast.error(error?.message || "Failed to delete plan");
    //   }
    // };


    const fetchData = useCallback(async () => {
        try {
            await dispatch(getAllSubscriptionPlansAdminThunk()).unwrap();
        } catch (error) {
            console.error("Failed to fetch subscription plans", error);
        }
    }, [dispatch]);


    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        if (!dialogOpen) {
            setSelectedPlan(null)
        }
    }, [dialogOpen]);

    const { values,
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        errors,
        setFieldValue,
        resetForm,
        isSubmitting, } = formik

    if (!isLoading && (!subscriptionPlan || subscriptionPlan.length === 0)) {
        return (
            <div className="bg-bg-card border border-border-primary rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <p className="text-sm text-text-tertiary">
                    No subscription plans available.
                </p>
            </div>
        );
    }

    return (
        <>

            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">Subscription Plans</h2>
                        <p className="text-sm text-text-tertiary mt-1">Manage your subscription plans</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="primary"
                            className="!w-fit rounded-lg"
                            icon={<Plus className="w-4 h-4" />}
                            onClick={() => setDialogOpen(true)}
                        >
                            Create Plan
                        </Button>
                    </div>
                </div>

                {isLoading ? <div className="mb-8"><PricingCardSkeleton /></div> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {subscriptionPlan.map((plan) => (
                        <div
                            key={plan.id}
                            className={cn(
                                "relative flex flex-col rounded-xl border border-border-primary bg-gradient-to-b from-bg-secondary/80 via-bg-secondary to-bg-secondary/60 py-6 px-5 shadow-lg hover:border-border-accent transition-colors",
                                plan.isRecommended ? "ring-1 ring-accent-primary/40 shadow-accent" : ""
                            )}
                        >
                            {plan.isRecommended && (
                                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-fit px-2 py-0.5 rounded-full bg-accent-primary text-black text-xs font-semibold">
                                    Most Popular
                                </span>
                            )}



                            <div className="absolute right-3 top-3">
                                <Dropdown>
                                    <DropdownTrigger className="!w-fit !px-2 border-none bg-transparent">
                                        <MoreVertical className="w-4 h-4" /></DropdownTrigger>
                                    <DropdownContent className="!w-36 !min-w-0">
                                        <DropdownItem
                                            onClick={() => handleEditPlan(plan)}
                                            icon={<Edit className="w-4 h-4" />}>
                                            Edit
                                        </DropdownItem>

                                        {/* <DropdownItem danger
                              icon={<Trash2 className="w-4 h-4" />}
                              onClick={() => { setDeletePlanDialogOpen(true), setDeletePlan({ id: plan.id, name: plan.name }); }}
                            >
                              Delete
                            </DropdownItem> */}

                                        <DropdownItem
                                            danger={plan.isActive !== false}
                                            success={plan.isActive === false}
                                            icon={plan.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                            onClick={() => handleIsActivePlan(plan)}
                                        >
                                            {plan.isActive ? "Deactivate" : "Activate"}
                                        </DropdownItem>


                                    </DropdownContent>
                                </Dropdown>
                            </div>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-3">
                                        {plan.name}{" "}

                                        <span
                                            className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                                                plan.isActive
                                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                            )}
                                        >
                                            {plan.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </h3>
                                    <p className="text-sm text-text-tertiary mt-1">{plan.description}</p>
                                </div>
                            </div>

                            {/* <div className="mb-4">
                                {plan.trialDays ? (
                                    // Trial plan UI
                                    <p className="text-3xl font-bold text-accent-primary leading-tight">
                                        {plan.trialDays}-day Free Trial
                                    </p>
                                ) : (
                                    // Regular paid plan UI
                                    <p className="text-3xl font-bold text-accent-primary leading-tight">
                                        ${plan.price != null ? plan.price.toFixed(2) : '0.00'}
                                        <span className="text-sm font-normal text-text-tertiary ml-1">
                                            {plan.duration === 12 ? "/yr (billed annually)" : "/mo"}
                                        </span>
                                    </p>
                                )}
                            </div> */}

                            <div className="mb-6">
                                {plan.trialDays ? (
                                    <p className="text-3xl font-bold text-accent-primary leading-tight">
                                        {plan.trialDays}-day Free Trial
                                    </p>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        {/* Price Section */}
                                        <div className="flex items-baseline gap-2">
                                            {/* Main Price */}
                                            {plan.price && <p className="text-3xl font-bold text-accent-primary leading-tight">
                                                ${(
                                                    plan.duration === 12
                                                        ? plan.price * (1 - (plan.discountPercent ?? 0) / 100)
                                                        : plan.price
                                                ).toFixed(2)}
                                            </p>
                                            }
                                            {/* Monthly / Yearly Label */}
                                            <span className="text-sm font-normal text-text-tertiary">
                                                {plan.duration === 12 ? "/yr" : "/mo"}
                                            </span>

                                            {/* Original Price if Discounted */}
                                            {plan.price != null && (plan.discountPercent ?? 0) > 0 && (
                                                <span className="text-lg text-text-tertiary line-through ">
                                                    ${plan.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Clean Discount Badge */}
                                        {(plan.discountPercent ?? 0) > 0 && (
                                            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30   px-3 py-1 rounded-full text-xs font-semibold">
                                                {plan.discountPercent}% Off
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>





                            <div className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-sm text-text-primary/90">
                                        <div className="w-5 h-5 rounded-full  flex items-center justify-center mr-2">
                                            <Check className="w-4 h-4 text-accent-primary" />
                                        </div>
                                        <span>{feature.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>}
            </div>
            {/* Create and Edit Plan Dialog */}
            <Popup
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title={selectedPlan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
                description={
                    selectedPlan
                        ? "Update the subscription plan details."
                        : "Create a new subscription plan that will be available for customers to purchase."
                }
                footer={
                    <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 w-full">
                        <Button
                            className="!w-full sm:!w-fit"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            className="!w-full sm:!w-fit"
                            disabled={isSubmitting}
                            onClick={(e) => {
                                e.stopPropagation();
                                formik.validateForm();
                                formik.handleSubmit();
                            }}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>

                                    {selectedPlan ? "Updating..." : "Creating..."}
                                </span>
                            ) : (
                                selectedPlan
                                    ? "Update Plan"
                                    : "Create Plan"
                            )}
                        </Button>
                    </div>
                }
            >
                <form className="space-y-4" noValidate onSubmit={(e) => e.preventDefault()}>
                    {/* Plan Name */}
                    <div className="space-y-2 w-full">
                        <label htmlFor="planName" className="block text-sm font-medium text-gray-300">
                            Plan Name
                        </label>
                        <div className="flex flex-col">
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="e.g., Premium Plan"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {touched.name && errors.name && (
                                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Price and Billing Cycle */}
                    {!values.isTrial && <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                                Price ($)
                            </label>
                            <div className="flex flex-col">
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={values.price === 0 ? "" : values.price}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFieldValue("price", val === "" ? "" : parseFloat(val));
                                    }}
                                    onBlur={handleBlur}
                                />
                                {touched.price && errors.price && (
                                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-300">
                                Billing Cycle
                            </label>
                            <Select
                                value={values.duration === 1 ? "monthly" : "yearly"}
                                onValueChange={(val) => {
                                    formik.setFieldValue("duration", val === "monthly" ? 1 : 12);
                                }}

                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select billing cycle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>


                    </div>}

                    {/* Discount (Yearly only) */}
                    {!values.isTrial && values.duration === 12 && (
                        <div className="space-y-2 w-full">
                            <label
                                htmlFor="discountPercent"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Discount (%)
                            </label>

                            <div className="relative">
                                <Input
                                    id="discountPercent"
                                    name="discountPercent"
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={1}
                                    placeholder="0"
                                    value={values.discountPercent ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFieldValue(
                                            "discountPercent",
                                            val === "" ? "" : Math.min(100, Math.max(0, Number(val)))
                                        );
                                    }}
                                    onBlur={handleBlur}
                                    className="pr-10"
                                />

                                {/* % suffix */}
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                                    %
                                </span>
                            </div>

                            {/* Helper text */}
                            <p className="text-xs text-text-muted">
                                Applied only to yearly subscriptions
                            </p>

                            {/* Error */}
                            {touched.discountPercent && errors.discountPercent && (
                                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {errors.discountPercent}
                                </p>
                            )}
                        </div>
                    )}


                    {/* Description */}
                    <div className="space-y-2 w-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                            Description
                        </label>
                        <div className="flex flex-col">
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={values.description}
                                placeholder="Brief description of the plan"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-border-accent resize-none"
                            />
                            {touched.description && errors.description && (
                                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 w-full mb-7">
                        <div className="space-y-2 w-full mb-7">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                                <Button
                                    disabled={values.features[values.features.length - 1].name.trim() === ""}
                                    type='text'
                                    size="small"
                                    icon={<Plus className="w-4 h-4" />}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setFieldValue("features", [
                                            ...values.features,
                                            { name: "" },
                                        ]);
                                    }}
                                    className="!w-fit !h-fit !px-2 !py-2"
                                >
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {values.features.map((feature, index) => {
                                    return (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Input
                                                name={`features.${index}.name`}
                                                value={feature.name}
                                                onChange={(e) => {
                                                    const updated = [...values.features];
                                                    updated[index] = { name: e.target.value };
                                                    setFieldValue("features", updated);
                                                }}
                                                onBlur={handleBlur}
                                                placeholder={`Feature ${index + 1}`}
                                                className="flex-1"
                                            />

                                            {/* Only allow removing if there’s more than 1 */}
                                            {values.features.length > 1 && (
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    danger
                                                    icon={<X className="w-4 h-4" />}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setFieldValue(
                                                            "features",
                                                            values.features.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                    className="!w-fit !h-fit !px-2 !py-2"
                                                />
                                            )}
                                        </div>
                                    )
                                })}

                                {/* Error Message */}
                                {touched.features && typeof errors.features === "string" && (
                                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.features}
                                    </p>
                                )}

                            </div>
                        </div>


                    </div>

                    {/* Switches */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={values.isActive}
                                onCheckedChange={(val) => setFieldValue("isActive", val)}

                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-300 cursor-pointer">
                                Plan is active and available for purchase
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch
                                checked={values.isRecommended}
                                onCheckedChange={(val) => setFieldValue("isRecommended", val)}
                            />
                            <label htmlFor="popular" className="text-sm font-medium text-gray-300 cursor-pointer">
                                Mark as Most Popular
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={!!values.isTrial}
                                onCheckedChange={(checked) => {
                                    setFieldValue("isTrial", checked);

                                    if (checked) {
                                        setFieldValue("trialDays", 14); // API expects this
                                        setFieldValue("duration", undefined);
                                        setFieldValue("price", undefined);
                                    } else {
                                        setFieldValue("trialDays", 0);
                                        setFieldValue("price", undefined);
                                        setFieldValue("duration", 1); // default monthly
                                    }
                                }}
                            />
                            <label className="text-sm font-medium text-gray-300 cursor-pointer">
                                14-day Free Trial
                            </label>
                        </div>


                    </div>
                </form>
            </Popup>
        </>

    )
}

export default SubscriptionPlansWrapper