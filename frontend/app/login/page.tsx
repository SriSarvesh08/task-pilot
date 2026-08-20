"use client"

import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Loader2 } from "lucide-react"

export default function LoginPage() {
  const { loginGuest, login, register, isLoading, error: authError } = useAuth()
  const [isLoginView, setIsLoginView] = React.useState(true)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [formError, setFormError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    
    if (!email || !password) {
      setFormError("Please fill in all fields")
      return
    }

    if (!isLoginView && password.length < 6) {
      setFormError("Password must be at least 6 characters")
      return
    }

    try {
      if (isLoginView) {
        await login({ email, password })
      } else {
        await register({ email, password })
      }
    } catch (err: any) {
      // The error is handled by auth-context, but we catch it here to prevent default behavior
    }
  }

  const error = formError || authError

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckSquare className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isLoginView ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {isLoginView 
              ? "Enter your email to sign in to your account"
              : "Enter your email below to create your account"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email
              </label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                Password
              </label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLoginView ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLoginView ? "Sign In" : "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              className="underline hover:text-primary"
              onClick={() => {
                setIsLoginView(!isLoginView)
                setFormError("")
              }}
              disabled={isLoading}
            >
              {isLoginView ? "Sign up" : "Sign in"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Button 
              variant="outline"
              size="lg" 
              className="w-full" 
              onClick={loginGuest} 
              disabled={isLoading}
              type="button"
            >
              {isLoading && !email && !password ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Guest Access
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              Guest accounts are temporary.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
