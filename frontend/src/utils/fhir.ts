export function generateFHIRBundle(patientId: string, result: any) {
  const dateStr = new Date().toISOString();
  
  const observationEntries = Object.keys(result.modalities).map((mod, index) => {
    const modData = result.modalities[mod];
    return {
      fullUrl: `urn:uuid:observation-${mod}-${index}`,
      resource: {
        resourceType: "Observation",
        status: "final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/observation-category",
                code: "exam",
                display: "Exam"
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "116336005", 
              display: `Neurological telemetry - ${mod}`
            }
          ]
        },
        subject: {
          reference: `Patient/${patientId}`
        },
        effectiveDateTime: dateStr,
        valueString: typeof modData.prediction === 'number' ? modData.prediction.toString() : JSON.stringify(modData.prediction),
        interpretation: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                code: modData.score > 0.5 ? "A" : "N",
                display: modData.score > 0.5 ? "Abnormal" : "Normal"
              }
            ]
          }
        ]
      }
    };
  });

  const bundle = {
    resourceType: "Bundle",
    type: "collection",
    timestamp: dateStr,
    entry: [
      {
        fullUrl: `urn:uuid:patient-${patientId}`,
        resource: {
          resourceType: "Patient",
          id: patientId,
          active: true
        }
      },
      ...observationEntries,
      {
        fullUrl: `urn:uuid:observation-fusion`,
        resource: {
          resourceType: "Observation",
          status: "final",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "273249006", 
                display: "Assessment scale score"
              }
            ]
          },
          subject: {
            reference: `Patient/${patientId}`
          },
          effectiveDateTime: dateStr,
          valueQuantity: {
            value: result.fusion?.motor_consistency_score || 0,
            unit: "%",
            system: "http://unitsofmeasure.org",
            code: "%"
          },
          note: [
            {
              text: result.fusion?.explainable_ai?.recommendation || "No recommendation"
            }
          ]
        }
      }
    ]
  };

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fhir-report-${patientId}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
