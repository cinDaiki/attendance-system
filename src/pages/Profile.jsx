import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Profile() {

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name:"",
    phone:"",
    department:""
  });


  useEffect(()=>{
    fetchProfile();
  },[]);


  async function fetchProfile(){

    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();


    const { data, error } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          phone: form.phone,
          department: form.department,
        })
        .eq("id", user.id)
        .select();

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) {
        alert(error.message);
        return;
      }


    setProfile(data);

    setForm({
      name:data.name,
      phone:data.phone || "",
      department:data.department || ""
    });

  }



  async function updateProfile(){

    const {
      data:{
        user
      }
    }=await supabase.auth.getUser();



    const {error}=await supabase
      .from("profiles")
      .update({
        name:form.name,
        phone:form.phone,
        department:form.department
      })
      .eq("id",user.id);


            if (error) {
        console.log(error); 
        alert(JSON.stringify(error, null, 2));
        return;
      }

    alert("Profile updated!");

  }



return (

<div>

<h1>
Employee Profile
</h1>


<label>
Name
</label>

<input
value={form.name}
onChange={(e)=>
setForm({
...form,
name:e.target.value
})
}
/>


<label>
Phone
</label>

<input
value={form.phone}
onChange={(e)=>
setForm({
...form,
phone:e.target.value
})
}
/>


<label>
Department
</label>

<select
  value={form.department}
  onChange={(e) =>
    setForm({
      ...form,
      department: e.target.value,
    })
  }
>
  <option value="">Select Department</option>
  <option value="IT">IT</option>
  <option value="HR">HR</option>
  <option value="Finance">Finance</option>
</select>


<br/>

<button onClick={updateProfile}>
Save Changes
</button>


</div>

)

}


export default Profile;