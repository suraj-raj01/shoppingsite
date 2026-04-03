export default function FooterSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-5 w-full animate-pulse">
      
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          
          {/* Category Title */}
          <div className="h-4 w-24 bg-gray-700 rounded mb-3"></div>

          {/* Subcategories */}
          <div className="space-y-3 border-l border-gray-700 pl-2">
            
            {[...Array(4)].map((_, j) => (
              <div key={j}>
                
                {/* Subcategory */}
                <div className="h-3 w-20 bg-gray-700 rounded mb-2"></div>

                {/* Brands */}
                <div className="space-y-1 ml-2">
                  {[...Array(3)].map((_, k) => (
                    <div
                      key={k}
                      className="h-2 w-16 bg-gray-800 rounded"
                    ></div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        </div>
      ))}

    </div>
  )
}