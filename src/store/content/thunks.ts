import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { EvidenceInterface, ErrorBasicInterface, GetEvidenceProps, GetEvidencesProps } from "@/interfaces";
import { parseErrorAxios } from "@/utils";

import {  } from "@/services/api";