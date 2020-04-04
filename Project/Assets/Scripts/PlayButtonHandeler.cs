using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using UnityEngine.EventSystems;


public class PlayButtonHandeler : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{

    public void OnClickPlay()
    {
        Debug.Log("play");
        SceneManager.LoadScene("BubbleGame");
    }

    public void OnPointerEnter(PointerEventData pointerEventData)
    {
        //Output to console the GameObject's name and the following message
        Debug.Log("Cursor Entering " + name + " GameObject");
        this.gameObject.transform.localScale += new Vector3(0.5f, 0.5f, 0);
    }

    //Detect when Cursor leaves the GameObject
    public void OnPointerExit(PointerEventData pointerEventData)
    {
        //Output the following message with the GameObject's name
        Debug.Log("Cursor Exiting " + name + " GameObject");
        this.gameObject.transform.localScale -= new Vector3(0.5f, 0.5f, 0);
    }


}
