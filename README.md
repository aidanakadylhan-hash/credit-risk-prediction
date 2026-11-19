---
title: Credit Risk Prediction
emoji: 📊
colorFrom: green
colorTo: blue
sdk: static
app_file: index.html
pinned: false
---

# Credit Risk Prediction

Assignment 10.5 by Aidana Kadylkhan. Educational demonstration of the original 150-tree Random Forest evaluated in Assignment 8.6. The model runs in the browser using the exported tree ensemble and preprocessing configuration. All 6,000 holdout scores were compared with the Python pipeline before publication.

## Run and test

Serve this folder with any HTTP static server and open index.html. Run `node test.mjs` to verify synthetic predictions and input validation. Node 22 or later is sufficient. The published model requires no Python runtime or external JavaScript dependencies.

## CI and deployment

The GitHub Actions workflow runs prediction tests on pull requests and pushes. A successful main branch run publishes the application to `Aidanam/credit-risk-prediction` using the GitHub repository secret `HF_TOKEN`. The token must have write access to this Space. The workflow does not retrain the model. A new model requires training, evaluation, export, and fixture review before committing.

## Scope

Static hosting was selected to keep the demonstration free because creating CPU Gradio and Docker Spaces currently requires a paid plan. This differs from the CPU Basic configuration described in the assignment. Inference happens on the visitor's device. There is no prediction API, authentication, production monitoring, or automated retraining.

The 2005 Taiwan dataset does not establish suitability for modern lending. Do not use this demonstration to approve or deny credit. Use fictional inputs. Negative bills are supported. Missing fields are rejected.

## Data attribution

Yeh, I. (2009). *Default of credit card clients* [Data set]. UCI Machine Learning Repository. https://doi.org/10.24432/C55S3H

## Deployment reference

Hugging Face. (n.d.). *Managing Spaces with GitHub Actions*. https://huggingface.co/docs/hub/en/spaces-github-actions
