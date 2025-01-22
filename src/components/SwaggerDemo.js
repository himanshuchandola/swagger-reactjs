import React, { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { SWAGGER_JSON_PATHS } from '../utility/constant';
import { merge } from 'openapi-merge';

const SwaggerDemo = () => {
    const [swaggerJson, setSwaggerJson] = useState(null);

    useEffect(() => {
        const fetchAndMergeSwaggerFiles = async () => {
            try {
                // Fetch all Swagger JSON files
                const swaggerFiles = await Promise.all(
                    SWAGGER_JSON_PATHS.map((path) =>
                        fetch(path)
                            .then((res) => {
                                return res.json();
                            })
                    )
                );


                // Prepare input for merge
                const mergeInputs = swaggerFiles.map((oas, index) => ({
                    oas, // The actual Swagger JSON content
                    pathModification: {
                        prepend: `/file${index + 1}`, // Optional path prefix for each file
                    },
                }));

                // Merge Swagger JSON files using openapi-merge
                const mergeResult = merge(mergeInputs);

                setSwaggerJson(mergeResult.output); // Set merged JSON for Swagger UI
            } catch (error) {
            }
        };

        fetchAndMergeSwaggerFiles();
    }, []);

    return <SwaggerUI spec={swaggerJson} />;
};

export default SwaggerDemo;
