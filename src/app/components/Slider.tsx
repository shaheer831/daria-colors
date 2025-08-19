import Image from "next/image";
const Slider = () => {
  return (
    <span
      style={{
        display: "inline-block",
        background: "linear-gradient(to bottom right, #F1BDC3, #a56a71)", // darker shade
      }}
      className="w-full rounded-4xl mt-5 text-white overflow-hidden"
    >
      <div className="w-full px-5 pt-7">
        <p className="font-Sen text-3xl">Modish Look</p>
        <p className="font-Sen text-[17px] mt-2.5 tracking-wider">
          Find Your Perfect Look by Dressing Up with Daira Colors, Get the
          Special Price!
        </p>
        <button className="bg-black px-8 mt-4 py-3 rounded-full text-[17px]">
          SHOP COLOR SWATCHES
        </button>
      </div>
      <div className="w-full h-[280px] relative overflow-hidden">
        <Image
          src="/family-home.png"
          alt="modal-cutted"
          fill
          className="object-cover scale-[1.02]"
        />
      </div>
    </span>
  );
};

export default Slider;
