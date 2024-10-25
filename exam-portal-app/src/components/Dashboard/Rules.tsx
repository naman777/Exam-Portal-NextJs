const Rules: React.FC = () => {
    return (
      <div className="p-6  rounded-md mt-6 bg-white w-full shadow-xl  ">
        <h2 className="text-lg font-bold mb-4">Rules and Regulations</h2>
        <ul className="list-disc list-inside space-y-2 text-[#8C8C8C]">
          <li>Allow us your video and audio permission for proctoring purpose. Otherwise you can&apos;t give test.</li>
          <li>Submit test before time otherwise it will be auto submitted at end.</li>
          <li>Do not leave the test unsubmitted it will not be considered.</li>
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
  