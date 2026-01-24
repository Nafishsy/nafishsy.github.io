---
layout: post
title:  "Explainable Multi-Modal Brain Tumor Localization using Attention-Guided YOLOv12"
date:   2025-10-01 00:00:00 +00:00
image: /images/brain_tumor.png
categories: research
author: "Nafiz Ahmed"
authors: "<strong>Nafiz Ahmed</strong>, Md Kishor Morol"
venue: "Submitted - Under Review"
arxiv:
code:
---
Engineered a custom YOLOv12 backbone with DenseBlock integration and hybrid attention modules (SE, SimAM, CoordAtt, ECA), reducing parameters by 15% while boosting inference speed by 20% on GPU. Achieved state-of-the-art performance on a 4-class brain tumor dataset (Glioma, Meningioma, No Tumor, Pituitary) with <strong>94.35% mAP@50</strong>. Incorporated multi-class Grad-CAM for interpretable AI, yielding 0.72 IoU alignment with ground-truth regions, enabling clinical trust through tumor-specific attention visualization.
