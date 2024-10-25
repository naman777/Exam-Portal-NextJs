const Rules: React.FC = () => {
    return (
      <div className="p-6  rounded-md mt-6 bg-white w-full shadow-xl  ">
        <h2 className="text-lg font-bold mb-4">Rules and Regulations</h2>
        <ul className="list-disc list-inside space-y-2 text-[#8C8C8C]">
          <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
          <li>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
          <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</li>
        </ul>
  
        <h2 className="text-lg font-bold mt-6 mb-4">Marking Scheme</h2>
        <ul className="list-disc list-inside space-y-2 text-[#8C8C8C]">
          <li>Detailed explanation of marking scheme will go here.</li>
          <li>Allotted marks for each question will be mentioned.</li>
        </ul>
      </div>
    );
  };
  
  export default Rules;
  