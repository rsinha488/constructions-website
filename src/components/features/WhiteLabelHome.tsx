import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Material from '@/models/Material';
import Testimonial from '@/models/Testimonial';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, ArrowRight, Quote, Phone, Mail, MapPin, Handshake, Users, CheckCircle2, ShieldCheck, Scale, DraftingCompass, Flame, Activity, HardHat, Banknote } from 'lucide-react';
import Hero from '@/components/features/Hero';
import { ITenant } from '@/models/Tenant';
import ContactForm from '@/components/features/ContactForm';

interface WhiteLabelHomeProps {
    tenant: ITenant;
}

export default async function WhiteLabelHome({ tenant }: WhiteLabelHomeProps) {
    await dbConnect();

    const materials = await Material.find({
        tenantId: tenant._id,
        isActive: true
    }).sort({ createdAt: -1 }).limit(8);

    const testimonials = await Testimonial.find({
        tenantId: tenant._id,
        isFeatured: true
    }).limit(3);

    return (
        <div className="flex flex-col gap-24 pb-24">
            <Hero
                title={tenant.name}
                subtitle="Your trusted partner in high-quality construction materials and professional contracting services."
                slug={tenant.slug}
            />

            {/* Stats Section */}
            <section className="relative -mt-16 z-20 container mx-auto px-4">
                <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-600 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-blue-900/20 border border-white/10 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32">
                        <div className="flex items-center gap-6 text-white">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Handshake className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-4xl md:text-5xl font-black tracking-tighter">591</p>
                                <p className="text-teal-50 font-bold uppercase tracking-widest text-xs opacity-80">Project Completed</p>
                            </div>
                        </div>

                        <div className="w-px h-16 bg-white/10 hidden md:block" />

                        <div className="flex items-center gap-6 text-white">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-4xl md:text-5xl font-black tracking-tighter">446</p>
                                <p className="text-teal-50 font-bold uppercase tracking-widest text-xs opacity-80">Satisfied Customers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-900 mb-4">Our Core Services</h2>
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="group hover:-translate-y-2 transition-all duration-500 border-slate-100">
                        <CardContent className="p-10 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-green-700 hover:scale-110 group-hover:text-white transition-colors">
                                <span className="text-2xl font-black">🧱</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Premium Materials</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">Sourcing the finest materials for durability and excellence in every build.</p>
                            <Link href="#materials">
                                <Button variant="outline" className="w-full">Browse Catalog</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="group hover:-translate-y-2 transition-all duration-500 border-slate-100">
                        <CardContent className="p-10 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-green-700 hover:scale-110 group-hover:text-white transition-colors">
                                <span className="text-2xl font-black">

                                    🏗️</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Expert Contracting</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">Professional management and execution of construction projects of all scales.</p>
                            <Link href="#contact">
                                <Button variant="outline" className="w-full">Our Services</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="group hover:-translate-y-2 transition-all duration-500 border-slate-100">
                        <CardContent className="p-10 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-green-700 hover:scale-110 group-hover:text-white transition-colors">
                                <span className="text-2xl font-black">📐</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Custom Solutions</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">Tailored strategies and materials to meet your specific project requirements.</p>
                            <Link href="#solutions">
                                <Button variant="outline" className="w-full">Get in Touch</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Materials Section */}
            <section id="materials" className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 mb-4">Materials Catalog</h2>
                            <p className="text-slate-500">High-quality materials for your construction needs.</p>
                        </div>
                        <Link href={`/${tenant.slug}/materials`}>
                            <Button variant="ghost" className="gap-2 font-bold">
                                View Full Catalog <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {materials.map((material) => (
                            <Card key={material._id.toString()} className="group border-none shadow-sm hover:shadow-xl transition-all">
                                <div className="aspect-square bg-white relative overflow-hidden">
                                    {material.images?.[0] ? (
                                        <img
                                            src={material.images[0]}
                                            alt={material.name}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                                    )}
                                </div>
                                <CardContent className="p-6">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                                        {material.category}
                                    </p>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{material.name}</h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xl font-black text-slate-900">₹{material.price}</span>
                                        <Link href={`/materials/${material._id}`}>
                                            <Button size="sm" variant="ghost" className="p-0 h-auto hover:bg-transparent text-primary font-bold">
                                                Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom Solutions Section */}
            <section id="solutions" className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 mb-8">Tailored Solutions for Every Project</h2>
                        <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                            We understand that every construction project has unique challenges. Our team provides custom-engineered materials and strategic consultation to ensure your vision becomes a reality.
                        </p>
                        <ul className="space-y-4 mb-10">
                            {[
                                'Custom Concrete Mix Designs',
                                'Specialized Structural Steel Fabrication',
                                'Sustainable & Eco-friendly Material Sourcing',
                                'On-site Technical Consultation',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="#contact">
                            <Button size="lg" className="px-10">Request a Consultation</Button>
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-slate-100 rounded-[40px] overflow-hidden">
                            <img
                                src="/images/custom-solutions.png"
                                alt="Custom Solutions"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 hidden md:block">
                            <p className="text-3xl font-black text-primary mb-1">15+</p>
                            <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Years Experience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Why Choose Us?</h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <CheckCircle2 className="w-10 h-10" />, title: "250+ Quality Check", color: "bg-yellow-500" },
                            { icon: <ShieldCheck className="w-10 h-10" />, title: "100% Money Safety", color: "bg-emerald-500" },
                            { icon: <Scale className="w-10 h-10" />, title: "Compliance With Legal Regulation", color: "bg-purple-500" },
                            { icon: <DraftingCompass className="w-10 h-10" />, title: "Customized Design & Vastu Consultation", color: "bg-blue-500" },
                            { icon: <Flame className="w-10 h-10" />, title: "Insured Against Fire", color: "bg-orange-500" },
                            { icon: <Activity className="w-10 h-10" />, title: "Earthquake Safe", color: "bg-amber-500" },
                            { icon: <HardHat className="w-10 h-10" />, title: "Full Time Engineer on site", color: "bg-slate-700" },
                            { icon: <Banknote className="w-10 h-10" />, title: "Loan Facility Available", color: "bg-cyan-500" },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:scale-105 transition-all duration-300">
                                <div className={`${feature.color} w-20 h-20 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-${feature.color.split('-')[1]}-200 group-hover:rotate-12 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight">
                                    {feature.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-900 mb-4">What Our Clients Say</h2>
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {testimonials.map((t) => (
                        <div key={t._id.toString()} className="relative p-8 bg-white border border-slate-100 rounded-3xl">
                            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-slate-100 -z-0" />
                            <div className="relative z-10">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-lg text-slate-600 italic mb-8 leading-relaxed">
                                    "{t.content}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary">
                                        {t.userName[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{t.userName}</p>
                                        <p className="text-xs text-slate-500 font-medium">{t.userRole}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Info */}
            <section id="contact" className="bg-slate-900 text-white py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-black mb-8">Ready to Start Your Project?</h2>
                            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                                Contact us today for a free consultation and quotation on our materials and services.
                            </p>
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Phone</p>
                                        <p className="text-lg font-bold">{tenant.contact.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Email</p>
                                        <p className="text-lg font-bold">{tenant.contact.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Address</p>
                                        <p className="text-lg font-bold">{tenant.contact.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 p-8 md:p-12 rounded-[40px] border border-white/10 backdrop-blur-sm">
                            <ContactForm
                                tenant={structuredClone(tenant)}
                                hideInfo={true}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
