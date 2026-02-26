import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { travelApis, type travelResponse } from "../../apis/travelApis";
import UpdateTravelForm from "../../components/travels/UpdateTravelForm";

const UpdateTravelPage = () => {
  const { id } = useParams();

  const [travel, setTravel] = useState<travelResponse | null>(null);

  useEffect(() => {
    travelApis.getTravelById(Number(id)).then(setTravel);
  }, [id]);

  if (!travel) return <div>Loading...</div>;

  return <div>
    <UpdateTravelForm travel={travel}/>
  </div>;
};

export default UpdateTravelPage;
