
export function Footer() {
  return (
    <footer className="py-12 bg-[#F0F2F1]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-[#6A9C89] mb-2">Soft Facture</h3>
            <p className="text-sm text-gray-600">© 2025 Soft Facture</p>
          </div>
          
          <div className="md:text-right">
            <div className="flex flex-wrap justify-start md:justify-end gap-6">
              <a href="#fonctionnalites" className="text-sm text-gray-600 hover:text-[#6A9C89] transition-colors">
                Fonctionnalités
              </a>
              <a href="#tarifs" className="text-sm text-gray-600 hover:text-[#6A9C89] transition-colors">
                Tarifs
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#6A9C89] transition-colors">
                CGU
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#6A9C89] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
