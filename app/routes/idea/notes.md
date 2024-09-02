# Expected behavior ->

# we have to make it use mutate it is not responsive 
# i have to find a way to take the id from Qadad's compoenet and use it in mine
# i habe to render the update/delete buttons and functionalites and check if the user is authenticated or not
# i want to redirect the user to the login page/process if he want to access the view details page
# the user can view the details of any idea he wants but he must be logged in, but if he does not own the idea he can't delet/update it



# Actual behavior ->

## render the details of the idea
## takes id from Qadad's component 
## render at max 3 other ideas based on their category
## almost manages that if the user is not logged in we should redirect him to the login process(i could'nt call the login process but the logic is present)
## it does not render the details if the user is not logged in


# remaining fuck ups

## redirect the user to the login process if he is not logged in
## does not refresh automatically we have to use mutate/useEffect
## conditional rendering