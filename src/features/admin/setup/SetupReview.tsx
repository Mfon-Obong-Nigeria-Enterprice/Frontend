import { useNavigate } from "react-router-dom";
import SetupTitle from "./SetupTitle";
import ProgressBar from "../../../components/ProgressBar";
import ReviewSummary from "./ReviewSummary";
import Button from "../../../components/ui/Button";

const SetupReview = () => {
  const navigate = useNavigate();

  return (
    <main className="bg-white md:max-w-[90%] lg:max-w-[80%] w-full mx-auto rounded-[0.625rem] overflow-hidden shadow-2xl font-Inter">
      <SetupTitle
        title="Review & Launch"
        description="Review your set-up before launching the system"
      />
      <ProgressBar currentStep={5} totalSteps={5} />

      <section className="px-6 py-10">
        <h3 className="font-medium text-xl leading-none text-text-dark mb-3">
          Setup Summary
        </h3>
        <div className="flex flex-col gap-6">
          <ReviewSummary
            summaryHeading="Business Information"
            summaryName="Name:"
            nameVal="Mfon-Obong Nigeria Enterprise"
            phoneOrEstimate="Phone:"
            phoneOrEstimateValue={2341234567890}
            address="Address:"
            addressValue="124, Abak road"
          />
          <ReviewSummary
            summaryHeading="Inventory Summary"
            summaryName="Products:"
            nameVal="3"
            phoneOrEstimate="Est. Inventory Value:"
            phoneOrEstimateValue="# 2,125,000"
          />
          <ReviewSummary
            summaryHeading="Clients Summary"
            summaryName="Clients"
            nameVal="3"
            phoneOrEstimate="Total Credit Balance:"
            phoneOrEstimateValue="#0,00"
          />
        </div>
      </section>

      <div className="flex justify-between mb-10 mx-10">
        <div className="border border-secondary rounded-lg text-secondary">
          <Button
            text="Back"
            variant="outline"
            onClick={() => navigate("/admin-setup-04")}
          />
        </div>
        <div>
          <Button
            text="Complete Setup"
            onClick={() => {
              navigate("/admin-setup-complete");
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default SetupReview;
