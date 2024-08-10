import express from "express";

// https://stackoverflow.com/questions/65848442/property-user-does-not-exist-on-type-requestparamsdictionary-any-any-pars
declare global {
  namespace Express {
    interface Request {
      user?: Record<string,any>
    }
  }
}