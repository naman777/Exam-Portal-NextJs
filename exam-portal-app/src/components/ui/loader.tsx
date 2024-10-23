import { BeatLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="bg-[rgba(0,0,0,0.5)] flex justify-center items-center h-screen w-screen fixed top-0 left-0">
      <BeatLoader color="#0BAADD" />
    </div>
  );
};

export default Loader;
