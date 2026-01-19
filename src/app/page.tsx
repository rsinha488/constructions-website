import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Tenant from '@/models/Tenant';
import Material from '@/models/Material';
import Testimonial from '@/models/Testimonial';
import GlobalNavbar from '@/components/layout/GlobalNavbar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, ArrowRight, Building2, Package, Quote } from 'lucide-react';
import { getWhiteLabelTenant } from '@/lib/tenant';
import WhiteLabelHome from '@/components/features/WhiteLabelHome';

export default async function RootPage() {
  const whiteLabelTenant = await getWhiteLabelTenant();

  if (whiteLabelTenant) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalNavbar />
        <WhiteLabelHome tenant={whiteLabelTenant} />
        <footer className="py-12 border-t border-slate-100 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              © 2026 {whiteLabelTenant.name}. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  await dbConnect();
  const tenants = await Tenant.find({ 'settings.isActive': true }).limit(6);
  const materials = await Material.find({ isActive: true }).sort({ createdAt: -1 }).limit(8);
  const testimonials = await Testimonial.find({ isFeatured: true }).limit(3);

  return (
    <div className="min-h-screen bg-white">
      <GlobalNavbar />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#334155_0%,transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
            The Future of <span className="text-blue-500">Construction</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with top-tier construction companies, browse premium materials, and manage your projects all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#materials">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Browse Materials
              </Button>
            </Link>
            <Link href="#companies">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800">
                View Companies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Building2 className="text-blue-600" />
                Partner Companies
              </h2>
              <p className="text-slate-500 mt-2">Trusted construction and contracting experts.</p>
            </div>
            <Link href="#companies">
              <Button variant="ghost" className="hidden sm:flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tenants.map((tenant) => (
              <Link key={tenant.slug} href={`/${tenant.slug}`}>
                <Card className="hover:shadow-xl transition-all border-none bg-white group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{tenant.name}</h3>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">{tenant.contact.address}</p>
                    <div className="flex items-center text-blue-600 font-bold text-sm">
                      Explore Company <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section id="materials" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
              <Package className="text-blue-600" />
              Materials Catalog
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              High-quality construction materials sourced from our trusted partners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {materials.map((material) => (
              <Card key={material._id.toString()} className="group border-slate-100">
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  {material.images?.[0] ? (
                    <img
                      src={material.images[0]}
                      alt={material.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
                    {material.category}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{material.name}</h3>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-1">{material.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-black text-slate-900">₹{material.price}</span>
                    <Link href={`/materials/${material._id}`}>
                      <Button size="sm" variant="ghost" className="p-0 h-auto hover:bg-transparent text-blue-600 font-bold">
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Customer Feedback</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((t) => (
              <div key={t._id.toString()} className="relative">
                <Quote className="absolute -top-4 -left-4 w-12 h-12 text-slate-800 -z-0" />
                <div className="relative z-10">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-lg text-slate-300 italic mb-6 leading-relaxed">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                      {t.userName[0]}
                    </div>
                    <div>
                      <p className="font-bold">{t.userName}</p>
                      <p className="text-xs text-slate-500">{t.userRole}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Construct Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
