// Product.jsx
import React from 'react';
import LatestCollection from '../component/LatestCollection';
import BestSeller from '../component/BestSeller';

function Product() {
  return (
    <div className="w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col items-center justify-start py-[20px]">
      
      {/* Latest Collection Section */}
      <div className="w-[100%] min-h-[70px] flex flex-col items-center justify-center gap-[10px]">
        <LatestCollection />
      </div>

      {/* Best Seller Section */}
      <div className="w-[100%] min-h-[70px] flex flex-col items-center justify-center gap-[10px]">
        <BestSeller />
      </div>
      
    </div>
  );
}

export default Product;