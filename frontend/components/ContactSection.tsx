"use client"

import { useState } from "react"
import { useTranslations } from "@/lib/i18n"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send, MapPin, Phone, Mail, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    request_type: z.enum(["INFO", "MEETING", "INVESTMENT"]),
    message: z.string().min(10),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactSection() {
    const t = useTranslations('contact')
    const tCommon = useTranslations('common')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const { toast } = useToast()

    const requestTypes = [
        { value: "INFO", label: t('form.requestTypes.info') },
        { value: "MEETING", label: t('form.requestTypes.meeting') },
        { value: "INVESTMENT", label: t('form.requestTypes.investment') },
    ]

    const contactInfo = [
        { icon: MapPin, label: "Adresse", value: "Boulevard Zerktouni, Casablanca" },
        { icon: Phone, label: "Téléphone", value: "+212 522 000 000" },
        { icon: Mail, label: "Email", value: "contact@sunsetplaza.ma" },
        { icon: Clock, label: "Horaires", value: "Lun - Ven: 9h - 18h" },
    ]

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            request_type: "INFO",
        },
    })

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)
        try {
            await api.post("/api/contacts/submit/", data)
            setIsSuccess(true)
            reset()
            toast({
                title: t('form.success'),
                description: t('form.success'),
                variant: "success",
            })
            setTimeout(() => setIsSuccess(false), 5000)
        } catch (error) {
            toast({
                title: tCommon('error'),
                description: t('form.error'),
                variant: "error",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="contact" className="py-32 bg-[#FAFAF8] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0A1628] to-transparent opacity-[0.02]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-20"
                >
                    <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#0A1628] tracking-tight">
                        {t('title')}
                    </h2>
                    {/* Decorative gold line */}
                    <div className="flex items-center justify-center gap-4 mt-6 mb-8">
                        <div className="h-px w-12 bg-[#C4A052]" />
                        <div className="h-1.5 w-1.5 rounded-full bg-[#C4A052]" />
                        <div className="h-px w-12 bg-[#C4A052]" />
                    </div>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
                        {t('subtitle')}
                    </p>
                </motion.div>

                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="font-serif text-2xl text-[#0A1628] mb-8">
                                Envoyez-nous un message
                            </h3>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-600 text-sm font-medium">{t('form.name')} *</Label>
                                        <Input
                                            id="name"
                                            placeholder="Votre nom complet"
                                            {...register("name")}
                                            className={`h-12 rounded-xl border-slate-200 focus:border-[#C4A052] focus:ring-[#C4A052]/20 ${errors.name ? "border-red-500" : ""}`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-600 text-sm font-medium">{t('form.email')} *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="votre@email.com"
                                            {...register("email")}
                                            className={`h-12 rounded-xl border-slate-200 focus:border-[#C4A052] focus:ring-[#C4A052]/20 ${errors.email ? "border-red-500" : ""}`}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-slate-600 text-sm font-medium">{t('form.phone')} *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+212 6 XX XX XX XX"
                                            {...register("phone")}
                                            className={`h-12 rounded-xl border-slate-200 focus:border-[#C4A052] focus:ring-[#C4A052]/20 ${errors.phone ? "border-red-500" : ""}`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="request_type" className="text-slate-600 text-sm font-medium">{t('form.requestType')} *</Label>
                                        <Select
                                            defaultValue="INFO"
                                            onValueChange={(value) => setValue("request_type", value as ContactFormData["request_type"])}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                                <SelectValue placeholder={t('form.requestType')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {requestTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-slate-600 text-sm font-medium">{t('form.message')} *</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Décrivez votre projet ou votre demande..."
                                        rows={5}
                                        {...register("message")}
                                        className={`rounded-xl border-slate-200 focus:border-[#C4A052] focus:ring-[#C4A052]/20 resize-none ${errors.message ? "border-red-500" : ""}`}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-14 rounded-xl bg-[#0A1628] hover:bg-[#1E293B] text-base font-medium"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        t('form.sending')
                                    ) : isSuccess ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            {t('form.success')}
                                        </>
                                    ) : (
                                        <>
                                            {t('form.submit')}
                                            <ArrowRight className="h-5 w-5 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-8"
                    >
                        {/* Info Cards */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                    className="p-6 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-shadow duration-300 group"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C4A052]/10 text-[#C4A052] mb-4 group-hover:bg-[#C4A052] group-hover:text-white transition-colors duration-300">
                                        <info.icon className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                                    <p className="font-medium text-[#0A1628]">{info.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Map */}
                        <div className="h-72 rounded-3xl bg-[#0A1628] flex items-center justify-center overflow-hidden relative">
                            {/* Grid pattern */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            />
                            <div className="text-center z-10">
                                <div className="w-16 h-16 rounded-2xl bg-[#C4A052] flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8 text-white" />
                                </div>
                                <p className="font-serif text-xl text-white mb-1">Sunset Plaza</p>
                                <p className="text-white/60">Boulevard Zerktouni</p>
                                <p className="text-white/60">Casablanca, Maroc</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
