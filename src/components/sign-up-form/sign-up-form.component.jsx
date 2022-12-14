import { useState } from "react";
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
import { SignUpContainer } from "./sign-up-form.styles";
import Button from "../button/button.component";

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const SignUpForm = () => {
  //将表单字段作为一个对象传入state更方便，而不是分别作为state
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {displayName, email, password, confirmPassword} = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(password !== confirmPassword) {
      alert("password do not match");
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email, password
      );

      await createUserDocumentFromAuth(user, { displayName })
      resetFormFields();
    } catch (error) {
      //捕获邮箱已被占用错误
      if(error.code === 'auth/email-already-in-use') {
        alert('cannot create user, email already in use');
      } else {
        console.log('user creation encountered an error', error);
      }
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  }

  return (
    <SignUpContainer>
      <h2>Don't have an account ?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput 
          label="Display Name"
          type="text" 
          required 
          onChange={handleChange} 
          name="displayName" 
          value={displayName} 
        />

        <FormInput 
          label="Email"
          type="email" 
          required 
          onChange={handleChange} 
          name="email" 
          value={email} 
        />

        <FormInput 
          label="Password"
          type="password" 
          required 
          onChange={handleChange} 
          name="password" 
          value={password} 
        />

        <FormInput 
          label="Confirm Password"
          type="password" 
          required 
          onChange={handleChange} 
          name="confirmPassword" 
          value={confirmPassword} 
        />

        <Button type="submit">Sign Up</Button>
      </form>
    </SignUpContainer>
  )
}

export default SignUpForm;