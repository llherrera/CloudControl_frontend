import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { ContentInterface, ErrorBasicInterface } from "@/interfaces";
import { parseErrorAxios } from "@/utils";

//export const 